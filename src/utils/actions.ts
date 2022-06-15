import { Bytes, crypto, store } from '@graphprotocol/graph-ts';
import { Action, Permission } from '../types/schema';

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
  const permissionId = crypto.keccak256(actionId.concat(account)).toHexString();

  // Permissions are unique so we don't worry about collisions
  const permission = new Permission(permissionId);
  permission.account = account;
  permission.action = actionId.toHexString();
  permission.txHash = txHash;

  permission.save();
}

export function removePermission(actionId: Bytes, account: Bytes): void {
  const permissionId = crypto.keccak256(actionId.concat(account)).toHexString();
  store.remove('Permission', permissionId);
}
