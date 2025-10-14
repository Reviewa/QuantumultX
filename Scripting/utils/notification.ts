// @ts-nocheck
export async function notify(title: string, body: string) {
  await Notification.schedule({ title, body })
}