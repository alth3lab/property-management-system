"use client";
import TableFormProvider, {
  useTableForm,
} from "@/app/context/TableFormProvider/TableFormProvider";
import { useDataFetcher } from "@/helpers/hooks/useDataFetcher";
import ViewComponent from "@/app/components/ViewComponent/ViewComponent";
import { useEffect, useState } from "react";

import { rentAgreementInputs } from "../rentInputs";
import { useToastContext } from "@/app/context/ToastLoading/ToastLoadingProvider";
import { submitRentAgreement } from "@/services/client/createRentAgreement";
import { RenewRentModal } from "@/app/UiComponents/Modals/RenewRent"; // Import the RenewRentModal

import { Box, Button, FormControl, Select, Typography } from "@mui/material";
import Link from "next/link";
import { StatusType } from "@/app/constants/Enums";
import MenuItem from "@mui/material/MenuItem";
import { formatCurrencyAED } from "@/helpers/functions/convertMoneyToArabic";
import DeleteBtn from "@/app/UiComponents/Buttons/DeleteBtn"; // Import the CancelRentModal
export default function PropertyPage({ searchParams }) {
  const propertyId = searchParams?.propertyId;
  return (
    <TableFormProvider url={"fast-handler"}>
      <RentWrapper propperty={propertyId} />
    </TableFormProvider>
  );
}

const RentWrapper = ({ propperty }) => {
  const {
    data: nonRentedData,
    loading: nonRentedLoading,
    page: nonRentedPage,
    setPage: setNonRentedPage,
    limit: nonRentedLimit,
    setLimit: setNonRentedLimit,
    totalPages: nonRentedTotalPages,
    setData: setNonRentedData,
    total: nonRentedTotal,
    setTotal: setNonRentedTotal,
    setRender: setNonRentedRender,
    others: nonRentedOthers,
    setOthers: setNonRentedOthers,
    search: nonRentedSearch,
    setSearch: setNonRentedSearch,
  } = useDataFetcher(`main/rentAgreements?rented=false&`);

  const { id,submitData } = useTableForm();
  async function handleDelete(id) {
    await submitData(
          null,
          null,
          id,
          "DELETE",
          null,
          null,
          "main/rentAgreements",
    );
  }
  const [propertyId, setPropertyId] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loadingProperty, setLoadingProperty] = useState(true);
  useEffect(() => {
    async function getD() {
      setLoadingProperty(true);
      const properties = await getProperties();

      setProperties(properties.data);
      setLoadingProperty(false);
    }

    getD();
  }, []);
  const [disabled, setDisabled] = useState({
    unitId: true,
  });
  const [reFetch, setRefetch] = useState({
    unitId: false,
  });
  const [renewModalOpen, setRenewModalOpen] = useState(false);
  const [renewData, setRenewData] = useState(null);

  async function getRenters() {
    const res = await fetch("/api/fast-handler?id=renter");
    const data = await res.json();

    return { data };
  }

  async function getRentTypes() {
    const res = await fetch("/api/fast-handler?id=rentType");
    const data = await res.json();
    const dataWithLabel = data.map((item) => {
      return {
        ...item,
        name: item.title,
      };
    });
    return { data: dataWithLabel };
  }

  async function getProperties() {
    const res = await fetch("/api/fast-handler?id=properties");
    const data = await res.json();
    return { data };
  }

  function handlePropertyChange(value) {
    setPropertyId(value);
    setDisabled({
      ...disabled,
      unitId: false,
    });
    setRefetch({
      ...reFetch,
      unitId: true,
    });
  }

  async function getUnits() {
    const res = await fetch(
      "/api/fast-handler?id=unit&propertyId=" + propertyId,
    );
    const data = await res.json();
    const dataWithLabel = data.map((item) => {
      return {
        ...item,
        name: item.number,
        disabled: item.rentAgreements?.some((rent) => rent.status === "ACTIVE"),
      };
    });

    return { data: dataWithLabel, id: propertyId };
  }

  async function getRentCollectionType() {
    const data = [
      { id: "TWO_MONTHS", name: "شهرين" },
      { id: "THREE_MONTHS", name: "ثلاثة أشهر" },
      { id: "FOUR_MONTHS", name: "أربعة أشهر" },
      { id: "SIX_MONTHS", name: "ستة أشهر" },
      { id: "ONE_YEAR", name: "سنة واحدة" },
    ];
    return { data };
  }

  const dataInputs = rentAgreementInputs.map((input) => {
    switch (input.data.id) {
      case "rentCollectionType":
        return {
          ...input,
          extraId: false,
          getData: getRentCollectionType,
        };
      case "renterId":
        return {
          ...input,
          extraId: false,
          getData: getRenters,
        };
      case "typeId":
        return {
          ...input,
          extraId: false,
          getData: getRentTypes,
        };
      case "propertyId":
        return {
          ...input,
          getData: getProperties,
          onChange: handlePropertyChange,
        };
      case "unitId":
        return {
          ...input,
          getData: getUnits,
        };
      default:
        return input;
    }
  });

  const handleOpenRenewModal = (rentData) => {
    setRenewData(rentData);
    setRenewModalOpen(true);
  };

  const handleCloseRenewModal = () => {
    setRenewModalOpen(false);
    setRenewData(null);
  };

  const { setLoading: setSubmitLoading } = useToastContext();
  const handleRenewSubmit = async (data) => {
    const extraData = { otherExpenses: [] };
    data = { ...data, extraData };
    const returedData = await submitRentAgreement(
      { ...data },
      setSubmitLoading,
      "PUT",
      [
        {
          route: `/${renewData.id}?installments=true`,
          message: "جاري البحث عن اي دفعات لم يتم استلامها...",
        },
        {
          route: `/${renewData.id}?feeInvoices=true`,
          message: "جاري البحث عن اي رسوم لم يتم دفعها...",
        },
        {
          route: `/${renewData.id}?otherExpenses=true`,
          message: "جاري البحث عن اي مصاريف اخري لم يتم دفعها...",
        },
        {
          route: `/${renewData.id}?renew=true`,
          message: "جاري تحديث حالة العقد القديم...",
        },
      ],
    );
    if (!returedData) return;

    handleCloseRenewModal();
  };

  const columns = [
    {
      field: "rentAgreementNumber",
      headerName: "رقم العقد",
      width: 200,
      printable: true,
      cardWidth: 48,
      renderCell: (params) => (
        <Link href={"rent/" + params.row.id}>
          <Button variant={"text"}>{params.row.rentAgreementNumber}</Button>
        </Link>
      ),
    },
    {
      field: "propertyId",
      headerName: "اسم العقار",
      width: 200,
      printable: true,
      cardWidth: 48,
      renderCell: (params) => (
        <Link href={"/properties/" + params.row.unit.property.id}>
          <Button variant={"text"}>{params.row.unit.property.name}</Button>
        </Link>
      ),
    },
    {
      field: "unit",
      headerName: "رقم الوحده",
      width: 200,
      printable: true,
      cardWidth: 48,
      renderCell: (params) => (
        <Link href={"/units/" + params.row.unit?.id}>
          <Button
            variant={"text"}
            sx={{
              maxWidth: 100,
              overflow: "auto",
            }}
          >
            {params.row.unit?.number}
          </Button>
        </Link>
      ),
    },

    {
      field: "renter",
      headerName: "المستأجر",
      width: 200,
      printable: true,
      cardWidth: 48,
      renderCell: (params) => (
        <Link
          href={"/renters/" + params.row.renter?.id}
          className={"flex justify-center"}
        >
          <Button variant={"text"}>{params.row.renter?.name}</Button>
        </Link>
      ),
    },
    {
      field: "status",
      headerName: "الحالة",
      width: 200,
      printable: true,
      cardWidth: 48,
      renderCell: (params) => {
        const today = new Date();
        const endDate = new Date(params.row.endDate);

        return (
          <Typography
            sx={{
              color:
                params.row.status === "ACTIVE" && endDate < today
                  ? "purple"
                  : params.row.status === "ACTIVE"
                    ? "green"
                    : "red",
            }}
          >
            {params.row.status === "ACTIVE" && endDate < today
              ? "يجب الغاءه"
              : StatusType[params.row.status]}
          </Typography>
        );
      },
    },
    {
      field: "startDate",
      headerName: "تاريخ البداية",
      width: 200,
      printable: true,
      cardWidth: 48,
      renderCell: (params) => (
        <>{new Date(params.row.startDate).toLocaleDateString()}</>
      ),
    },
    {
      field: "endDate",
      headerName: "تاريخ النهاية",
      width: 200,
      printable: true,
      cardWidth: 48,
      renderCell: (params) => (
        <>{new Date(params.row.endDate).toLocaleDateString()}</>
      ),
    },
    {
      field: "totalPrice",
      headerName: "السعر الكلي",
      width: 200,
      printable: true,
      cardWidth: 48,
      renderCell: (params) => <>{formatCurrencyAED(params.row.totalPrice)}</>,
    },
    {
      field: "actions",
      width: 250,
      printable: false,
      renderCell: (params) => (
        <>
          <DeleteBtn handleDelete={() => handleDelete(params.row.id)} />
        </>
      ),
    },
  ];

  async function submit(data) {
    return await submitRentAgreement(data, setSubmitLoading);
  }

  function handlePropertyFilterChange(event) {
    setNonRentedOthers("propertyId=" + event.target.value);
  }

  return (
    <>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexDirection: {
            xs: "column",
            sm: "row",
          },
          alignItems: "center",
        }}
      >
        <FormControl sx={{ mb: 2, maxWidth: 300 }}>
          <Typography variant="h6">عقود الايجار لعقار معين</Typography>
          <Select
            value={nonRentedOthers.split("=")[1] || "all"}
            onChange={handlePropertyFilterChange}
            displayEmpty
            fullWidth
            loading={loadingProperty}
          >
            <MenuItem value="all">حميع العقود </MenuItem>
            {properties?.map((property) => (
              <MenuItem value={property.id} key={property.id}>
                {property.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Link href="/rent/">
          <Button variant="text" color="secondary">
            عقود الايجار النشطة
          </Button>
        </Link>
      </Box>

      <ViewComponent
        inputs={dataInputs}
        formTitle={"انشاء عقد ايجار "}
        totalPages={nonRentedTotalPages}
        rows={nonRentedData}
        columns={columns}
        page={nonRentedPage}
        setPage={setNonRentedPage}
        limit={nonRentedLimit}
        setLimit={setNonRentedLimit}
        id={id}
        loading={nonRentedLoading}
        setData={setNonRentedData}
        setTotal={setNonRentedTotal}
        total={nonRentedTotal}
        noModal={true}
        disabled={disabled}
        reFetch={reFetch}
        submitFunction={submit}
        noTabs={true}
        url={"main/rentAgreements"}
        title={"عقود ايجار ملغيه"}
      />
      <RenewRentModal
        open={renewModalOpen}
        handleClose={handleCloseRenewModal}
        initialData={renewData}
        inputs={dataInputs}
        onSubmit={handleRenewSubmit}
      ></RenewRentModal>
    </>
  );
};
