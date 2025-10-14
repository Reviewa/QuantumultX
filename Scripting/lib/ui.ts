/**
 * Author: Reviewa
 * Module: ui
 */

export function buildStack(title: string, message: string) {
  const w = new ListWidget();
  const titleTxt = w.addText(title);
  titleTxt.font = Font.boldSystemFont(14);
  const msgTxt = w.addText(message);
  msgTxt.font = Font.systemFont(12);
  msgTxt.textColor = Color.gray();
  return w;
}