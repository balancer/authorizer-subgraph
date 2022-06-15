import { Bytes, crypto, store } from '@graphprotocol/graph-ts';
import { Action, Permission } from '../types/schema';
import { EVERYWHERE } from './constants';

function getPermissionId(actionId: Bytes, account: Bytes): Bytes {
  // To guarantee uniqueness, we copy the definition of permission IDs as used in the TimelockAuthorizer contract.
  // https://github.com/balancer-labs/balancer-v2-monorepo/blob/e7cf9d269f520882782627012e936e93563ece5c/pkg/vault/contracts/authorizer/TimelockAuthorizer.sol#L236-L242
  // TODO: Support `where`'s other than `EVERYWHERE`.
  return crypto.keccak256(actionId.concat(account).concat(EVERYWHERE));
}

export function addAction(actionId: Bytes): void {
  const id = actionId.toHexString();
  let action = Action.load(id);
  if (action != null) {
    return;
  }

  action = new Action(id);
  action.save();
}

export function addPermission(actionId: Bytes, account: Bytes, txHash: Bytes): void {
  const permissionId = getPermissionId(actionId, account).toHexString();

  // Permissions are unique so we don't worry about collisions
  const permission = new Permission(permissionId);
  permission.account = account;
  permission.action = actionId.toHexString();
  permission.txHash = txHash;

  permission.save();
}

export function removePermission(actionId: Bytes, account: Bytes): void {
  const permissionId = getPermissionId(actionId, account).toHexString();
  store.remove('Permission', permissionId);
}
