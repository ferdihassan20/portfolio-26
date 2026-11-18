// Status blocks shared by the PDF viewer. Every state keeps a way to get the deck.
function DownloadLink({ src }) {
  return <a className="button button-outline" href={src} download>Download PDF</a>;
}

export function PdfLoading({ src }) {
  return (
    <div className="pdf-status">
      <p>Loading deck…</p>
      <DownloadLink src={src} />
    </div>
  );
}

export function PdfError({ src }) {
  return (
    <div className="pdf-error">
      <p>Couldn't load the PDF.</p>
      <DownloadLink src={src} />
    </div>
  );
}
