import { UserList } from "./UserList";

export default function ProfesorMenu() {
  return (
    <div>
      <h2>Panel del Profesor</h2>
      <UserList reloadTrigger={0} />
    </div>
  );
}