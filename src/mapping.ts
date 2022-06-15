import { RoleGranted, RoleRevoked } from './types/authorizer/authorizer';
import { addAction, addPermission, removePermission } from './utils/actions';

export function handleRoleGranted(event: RoleGranted): void {
  addAction(event.params.role);
  addPermission(event.params.role, event.params.account, event.transaction.hash);
}

export function handleRoleRevoked(event: RoleRevoked): void {
  removePermission(event.params.role, event.params.account);
}
