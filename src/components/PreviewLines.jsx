// Grey bars that stand in for text inside decorative tool previews.
function PreviewLines({ widths }) {
  return (
    <div className="preview__lines">
      {widths.map((width, index) => (
        <span key={index} style={{ width }} />
      ))}
    </div>
  )
}

export default PreviewLines
