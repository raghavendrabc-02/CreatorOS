import { useEffect, useState } from 'react'
import { CheckIcon, CopyIcon, XIcon } from './icons.jsx'

// Older fallback for browsers or contexts where the Clipboard API is unavailable.
function copyWithSelection(text) {
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  textarea.select()
  const copied = document.execCommand('copy')
  textarea.remove()
  return copied
}

const LABELS = {
  idle: (label) => `Copy ${label}`,
  copied: (label) => `${label} copied`,
  failed: () => 'Copy failed. Select the text and copy it manually.',
}

// Copies `text` to the clipboard and briefly shows whether it worked.
function CopyButton({ text, label }) {
  const [status, setStatus] = useState('idle')

  useEffect(() => {
    if (status === 'idle') return
    const timer = setTimeout(() => setStatus('idle'), 1500)
    return () => clearTimeout(timer)
  }, [status])

  async function copy() {
    try {
      await navigator.clipboard.writeText(text)
      setStatus('copied')
    } catch {
      setStatus(copyWithSelection(text) ? 'copied' : 'failed')
    }
  }

  const Icon = status === 'copied' ? CheckIcon : status === 'failed' ? XIcon : CopyIcon
  const description = LABELS[status](label)

  return (
    <button
      type="button"
      className="icon-button icon-button--small"
      onClick={copy}
      disabled={!text}
      aria-label={description}
      title={description}
    >
      <Icon />
    </button>
  )
}

export default CopyButton
