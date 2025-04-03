import { UserInvitation } from "@/types/user-invitations";
import db from "../prisma";
import { sendEmail } from "../invitation-email";
import { SITE_NAME } from "../constants";

const userType: Record<string, string> = {
  SUPERADMIN: "Superadmin",
  ADMIN: "Admin",
  PRODUCER: "Productor",
  SELLER: "Punto de Venta / Vendedor",
};

export async function createUserInvitation(data: UserInvitation) {
  const invitation = await db.invitation.create({ data });
  const emailSubject = `Invitación a ${SITE_NAME}`;
  const emailBody = `
  <div style="font-family: Inter, Helvetica, sans-serif;margin: 0;">      
      <div style="margin: 0 auto;background-color: #ffffff;overflow: hidden;border: 1px solid #e5e7eb;border-radius: 0.5rem;">
        <div style="padding: 20px;border-bottom:1px solid #e5e7eb;">
          <h1 style="font-weight:400;color: #222222;">${SITE_NAME} te invita a participar de la ticketera como <span style="padding:4px;border-radius:.3rem;color:#222222;text-transform:uppercase;">${userType[data.role! || ""]}</span></h1>
        </div>
        <div style="padding: 20px; text-align: left">
          <p style="font-size: 1.2rem; line-height: 1; color: #222222">
            Para aceptar la invitación a la plataforma, hace click en "Acepto términos y condiciones de uso". ¡Gracias!.
          </p>
          <form
            action="${process.env.BASE_URL}/api/invitations/accept"
            method="POST"
            style="display: inline-block"
          >
            <input type="hidden" name="id" value="${invitation.id}" />
            <input type="hidden" name="t" value="${invitation.token}" />
            <button
              type="submit"
              style="display: inline-block;padding: 15px 25px;font-size: 16px;color: #ffffff;background-color: #0f172a;text-decoration: none;margin-top: 20px;cursor: pointer;border-radius: .5rem;">
              Acepto términos y condiciones de uso
            </button>
          </form>
        </div>
      </div>
    </div>
  `;

  await sendEmail(data.email, emailSubject, emailBody);

  return invitation;
}
export async function updateInvitationsById(
  data: Partial<UserInvitation>,
  invitationId: string
) {
  return await db.invitation.update({
    where: {
      id: invitationId,
    },
    data: data,
  });
}

export async function getInvitationsByUser(userId: string) {
  return await db.invitation.findMany({
    where: {
      inviterId: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}
export async function getPendingInvitationsByUser(userId: string) {
  return await db.invitation.findMany({
    where: {
      inviterId: userId,
      accepted: false,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getInvitationsById(invitationId: string) {
  return await db.invitation.findFirst({
    where: {
      id: invitationId,
    },
  });
}

export async function getInvitationsByEmail(userEmail: string) {
  return await db.invitation.findFirst({
    where: {
      email: userEmail,
    },
  });
}

export async function acceptInvitation(invitationId: string) {
  return await db.invitation.update({
    data: {
      accepted: true,
    },
    where: {
      id: invitationId,
    },
  });
}

export async function removeInvitationById(invitationId: string) {
  return await db.invitation.delete({
    where: {
      id: invitationId,
    },
  });
}
