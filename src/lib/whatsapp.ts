/**
 * Every "Commission Art" / "Enquire on WhatsApp" button on the site should
 * build its link through this helper, so the phone number and message
 * copy always come from the admin-configured Site Settings.
 */
export function buildWhatsAppLink(rawNumber: string, message: string) {
  const digitsOnly = rawNumber.replace(/[^\d]/g, "");
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${digitsOnly}?text=${encoded}`;
}

export function artworkEnquiryMessage(baseMessage: string, artworkTitle: string) {
  return `${baseMessage} I'm interested in commissioning an artwork similar to "${artworkTitle}".`;
}
