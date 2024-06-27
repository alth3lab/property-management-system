"use client";
import TableFormProvider, {
  useTableForm,
} from "@/app/context/TableFormProvider/TableFormProvider";
import { useDataFetcher } from "@/helpers/hooks/useDataFetcher";
import ViewComponent from "@/app/components/ViewComponent/ViewComponent";
import { useEffect, useState } from "react";

import { rentAgreementInputs } from "./rentInputs";
import { useToastContext } from "@/app/context/ToastLoading/ToastLoadingProvider";
import { submitRentAgreement } from "@/services/client/createRentAgreement";
import { RenewRentModal } from "@/app/UiComponents/Modals/RenewRent"; // Import the RenewRentModal
import { CancelRentModal } from "@/app/UiComponents/Modals/CancelRentModal";
import DeleteBtn from "@/app/UiComponents/Buttons/DeleteBtn";
import { Box, Button, FormControl, Select, Typography } from "@mui/material";
import Link from "next/link";
import { StatusType } from "@/app/constants/Enums";
import MenuItem from "@mui/material/MenuItem";
import { useRouter } from "next/navigation";
import { formatCurrencyAED } from "@/helpers/functions/convertMoneyToArabic"; // Import the CancelRentModal
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
    data,
    loading,
    page,
    setPage,
    limit,
    setLimit,
    totalPages,
    setData,
    total,
    setTotal,
    setRender,
    others,
    setOthers,
    search,
    setSearch,
  } = useDataFetcher(`main/rentAgreements?rented=true&`);
  const {
    data: expiredData,
    loading: expiredLoading,
    page: expiredPage,
    setPage: setExpiredPage,
    limit: expiredLimit,
    setLimit: setExpiredLimit,
    totalPages: expiredTotalPages,
    setData: setExpiredData,
    total: expiredTotal,
    setTotal: setExpiredTotal,
    setRender: setExpiredRender,
    others: expiredOthers,
    setOthers: setExpiredOthers,
    search: expiredSearch,
    setSearch: setExpiredSearch,
  } = useDataFetcher(`main/rentAgreements?rented=expired&`);
  const { id, submitData } = useTableForm();
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
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [renewData, setRenewData] = useState(null);
  const [cancelData, setCancelData] = useState(null);

  async function getRenters() {
    const res = await fetch("/api/fast-handler?id=renter");
    const data = await res.json();

    return { data };
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

    const filterData = data.filter((item) => +item.id !== +id);
    setData(filterData);
    setTotal((old) => old - 1);
    if (page === 1 && total >= limit) {
      setRender((old) => !old);
    } else {
      setPage((old) => (old > 1 ? old - 1 : 1) || 1);
    }
  }

  const handleOpenRenewModal = (rentData) => {
    setRenewData(rentData);
    setRenewModalOpen(true);
  };

  const handleCloseRenewModal = () => {
    setRenewModalOpen(false);
    setRenewData(null);
  };

  const handleOpenCancelModal = (rentData) => {
    setCancelData(rentData);
    setCancelModalOpen(true);
  };

  const handleCloseCancelModal = () => {
    setCancelModalOpen(false);
    setCancelData(null);
  };

  const handleCancelConfirm = async () => {
    await submitRentAgreement(
      { ...cancelData, canceling: true },
      setSubmitLoading,
      "PUT",
      [
        {
          route: `/${cancelData.id}?installments=true`,
          message: "جاري البحث عن اي دفعات لم يتم استلامها...",
        },
        {
          route: `/${cancelData.id}?feeInvoices=true`,
          message: "جاري البحث عن اي رسوم لم يتم دفعها...",
        },
        {
          route: `/${cancelData.id}?otherExpenses=true`,
          message: "جاري البحث عن اي مصاريف اخري لم يتم دفعها...",
        },
        {
          route: `/${cancelData.id}?cancel=true`,
          message: "جاري تحديث حالة العقد القديم...",
        },
      ],
      true,
    );
    const newData = data.filter((item) => {
      return item.id !== cancelData.id;
    });
    setData(newData);
    cancelData.status = "CANCELED";
    handleCloseCancelModal();
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
    setData((old) =>
      [...old, returedData].map((item) => {
        if (item.id !== renewData.id) {
          return item;
        }
      }),
    );
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
              ? "يجب اتخاذ اجراء"
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
          <Button
            variant="contained"
            color="primary"
            sx={{
              mt: 1,
              mr: 1,
            }}
            onClick={() => handleOpenRenewModal(params.row)}
          >
            تجديد
          </Button>
          {params.row.status === "ACTIVE" && (
            <>
              <Button
                variant="contained"
                color="secondary"
                sx={{
                  mt: 1,
                  mr: 1,
                }}
                onClick={() => handleOpenCancelModal(params.row)}
              >
                الغاء العقد
              </Button>
            </>
          )}
        </>
      ),
    },
  ];

  async function submit(data) {
    return await submitRentAgreement(data, setSubmitLoading);
  }

  function handlePropertyFilterChange(event) {
    setOthers("propertyId=" + event.target.value);
    setExpiredOthers("propertyId=" + event.target.value);
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
            value={others.split("=")[1] || "all"}
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
        <Link href="rent/canceled">
          <Button variant="text" color="secondary">
            عقود الايجار الملغية
          </Button>
        </Link>
      </Box>
      <ViewComponent
        inputs={dataInputs}
        formTitle={"عقد ايجار "}
        totalPages={totalPages}
        rows={data}
        columns={columns}
        page={page}
        setPage={setPage}
        limit={limit}
        setLimit={setLimit}
        extraData={{ otherExpenses: [] }}
        extraDataName={"otherExpenses"}
        id={id}
        loading={loading}
        setData={setData}
        setTotal={setTotal}
        total={total}
        noModal={true}
        disabled={disabled}
        reFetch={reFetch}
        submitFunction={submit}
        url={"main/rentAgreements"}
        title={"عقود الايجار النشطة"}
      ></ViewComponent>
      <ViewComponent
        inputs={dataInputs}
        formTitle={"عقد ايجار "}
        totalPages={expiredTotalPages}
        rows={expiredData}
        columns={columns}
        page={expiredPage}
        setPage={setExpiredPage}
        limit={expiredLimit}
        setLimit={setExpiredLimit}
        id={id}
        loading={expiredLoading}
        setData={setExpiredData}
        setTotal={setExpiredTotal}
        total={expiredTotal}
        noModal={true}
        disabled={disabled}
        reFetch={reFetch}
        submitFunction={submit}
        noTabs={true}
        url={"main/expiredRentAgreements"}
        title={"عقود ايجار بحاجة الي اتخاذ اجراء معها"}
      />

      <RenewRentModal
        open={renewModalOpen}
        handleClose={handleCloseRenewModal}
        initialData={renewData}
        inputs={dataInputs}
        onSubmit={handleRenewSubmit}
      ></RenewRentModal>

      <CancelRentModal
        open={cancelModalOpen}
        handleClose={handleCloseCancelModal}
        handleConfirm={handleCancelConfirm}
      />
    </>
  );
};
