"use client";
import TableFormProvider, {
  useTableForm,
} from "@/app/context/TableFormProvider/TableFormProvider";
import { Button } from "@mui/material";
import { useDataFetcher } from "@/helpers/hooks/useDataFetcher";
import ViewComponent from "@/app/components/ViewComponent/ViewComponent";
import { useEffect, useState, useCallback } from "react";
import { TextField, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { propertyTypeInputs } from "@/app/settings/property-type/propertyTypeInputs";
import DeleteBtn from "@/app/UiComponents/Buttons/DeleteBtn";
import CreateUserForm from "@/app/UiComponents/FormComponents/Forms/CreateUser/CreateUser";

export default function PropertyTypePage() {
  return (
    <TableFormProvider url={"settings/permissions"}>
      <PermissionsWrapper />
    </TableFormProvider>
  );
}

const PermissionsWrapper = () => {
  const {
    data,
    loading,
    page,
    setPage,
    limit,
    setLimit,
    totalPages,
    setData,
    setRender,
    total,
    setTotal,
  } = useDataFetcher("settings/permissions");
  const { setOpenModal, setId, id, submitData } = useTableForm();

  const handleEdit = (id) => {
    setId(id);
    setOpenModal(true);
  };

  async function handleDelete(id) {
    const res = await submitData(null, null, id, "DELETE");

    const filterData = data.filter((item) => item.id !== res.id);
    setData(filterData);
    setTotal((old) => old - 1);
    if (page === 1 && total >= limit) {
      setRender((old) => !old);
    } else {
      setPage((old) => (old > 1 ? old - 1 : 1) || 1);
    }
  }

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 100,
      printable: true,
      cardWidth: 48,
    },
    {
      field: "name",
      headerName: "اسم المستخدم",
      width: 200,
      printable: true,
      cardWidth: 48,
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
            onClick={() => handleEdit(params.row.id)}
            sx={{ mt: 1, mr: 1 }}
          >
            تعديل
          </Button>
          <DeleteBtn handleDelete={() => handleDelete(params.row.id)} />
        </>
      ),
    },
  ];
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");
  const [privileges, setPrivileges] = useState({});
  const extraData = {
    name,
    email,
    password,
    role,
    privileges,
  };

  useEffect(() => {
    if (data && id) {
      const user = data.find((user) => user.id === id);
      if (user) {
        setName(user.name);
        setEmail(user.email);
        setRole(user.role);
        setPassword(""); // Password should be empty to allow for re-entering
        const userPrivileges = user.privileges?.reduce((acc, priv) => {
          acc[priv.area] = priv.privilege;
          return acc;
        }, {});
        setPrivileges(userPrivileges);
      }
    }
  }, [data, id]);

  const memoizedSetName = useCallback((name) => setName(name), []);
  const memoizedSetEmail = useCallback((email) => setEmail(email), []);
  const memoizedSetPassword = useCallback(
    (password) => setPassword(password),
    [],
  );
  const memoizedSetRole = useCallback((role) => setRole(role), []);
  const memoizedSetPrivileges = useCallback(
    (privileges) => setPrivileges(privileges),
    [],
  );

  return (
    <>
      <ViewComponent
        inputs={[]}
        formTitle={"صلاحيات المستخدم"}
        totalPages={totalPages}
        rows={data}
        columns={columns}
        page={page}
        setPage={setPage}
        limit={limit}
        setLimit={setLimit}
        id={id}
        loading={loading}
        setData={setData}
        setTotal={setTotal}
        total={total}
        extraData={extraData}
      >
        <CreateUserForm
          email={email}
          name={name}
          setEmail={memoizedSetEmail}
          setName={memoizedSetName}
          role={role}
          setRole={memoizedSetRole}
          password={password}
          setPassword={memoizedSetPassword}
          privileges={privileges}
          setPrivileges={memoizedSetPrivileges}
          id={id}
          data={data}
        />
      </ViewComponent>
    </>
  );
};
