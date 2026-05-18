import { adminDb } from "@/lib/admin-firebase";

function generateInviteCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function createCouple(name, createdByUid) {
  let inviteCode;
  let exists = true;

  while (exists) {
    inviteCode = generateInviteCode();
    const snapshot = await adminDb
      .collection("couples")
      .where("inviteCode", "==", inviteCode)
      .get();
    exists = !snapshot.empty;
  }

  const coupleRef = await adminDb.collection("couples").add({
    name,
    inviteCode,
    memberIds: [createdByUid],
    createdBy: createdByUid,
    createdAt: new Date().toISOString(),
  });

  return { id: coupleRef.id, inviteCode };
}

export async function joinCouple(inviteCode, uid) {
  const snapshot = await adminDb
    .collection("couples")
    .where("inviteCode", "==", inviteCode.toUpperCase())
    .get();

  if (snapshot.empty) {
    return { error: "Invalid invite code" };
  }

  const coupleDoc = snapshot.docs[0];
  const coupleData = coupleDoc.data();

  if (coupleData.memberIds.includes(uid)) {
    return { error: "You are already a member of this couple" };
  }

  if (coupleData.memberIds.length >= 2) {
    return { error: "This couple is full" };
  }

  await coupleDoc.ref.update({
    memberIds: [...coupleData.memberIds, uid],
  });

  return { id: coupleDoc.id, ...coupleData };
}

export async function getCouple(coupleId) {
  const coupleDoc = await adminDb.collection("couples").doc(coupleId).get();
  if (!coupleDoc.exists) {
    return null;
  }
  return { id: coupleDoc.id, ...coupleDoc.data() };
}

export async function getCoupleByInviteCode(inviteCode) {
  const snapshot = await adminDb
    .collection("couples")
    .where("inviteCode", "==", inviteCode.toUpperCase())
    .get();

  if (snapshot.empty) {
    return null;
  }

  const coupleDoc = snapshot.docs[0];
  return { id: coupleDoc.id, ...coupleDoc.data() };
}

export async function getPartnerInfo(coupleId, excludeUid) {
  const couple = await getCouple(coupleId);
  if (!couple) return null;

  const partnerId = couple.memberIds.find((id) => id !== excludeUid);
  if (!partnerId) return null;

  const userDoc = await adminDb.collection("users").doc(partnerId).get();
  if (!userDoc.exists) return null;

  return { uid: partnerId, ...userDoc.data() };
}

export async function updateCoupleName(coupleId, name) {
  await adminDb.collection("couples").doc(coupleId).update({ name });
  return { success: true };
}