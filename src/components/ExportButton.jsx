export default function ExportButton({ nodes, edges }) {
  const handleExportJSON = () => {
    const flow = { nodes, edges };
    const blob = new Blob([JSON.stringify(flow, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.download = 'flow.json';
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportImage = async () => {
    try {
      const button = document.activeElement;
      const originalText = button.textContent;
      button.textContent = 'Exporting...';
      button.disabled = true;

      // Create a temporary container
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.top = '-9999px';
      tempContainer.style.left = '-9999px';
      tempContainer.style.width = '1200px';
      tempContainer.style.height = '800px';
      tempContainer.style.backgroundColor = '#f9fafb';
      document.body.appendChild(tempContainer);

      // Clone the flow content
      const flowCanvas = document.querySelector('.react-flow');
      const clonedFlow = flowCanvas.cloneNode(true);
      
      // Preserve all computed styles
      const allElements = flowCanvas.querySelectorAll('*');
      const clonedElements = clonedFlow.querySelectorAll('*');
      
      allElements.forEach((el, index) => {
        if (clonedElements[index]) {
          const computedStyle = window.getComputedStyle(el);
          const styleText = Array.from(computedStyle).reduce((str, property) => {
            return str + property + ':' + computedStyle.getPropertyValue(property) + ';';
          }, '');
          clonedElements[index].style.cssText = styleText;
        }
      });

      tempContainer.appendChild(clonedFlow);

      // Wait a moment for styles to be applied
      await new Promise(resolve => setTimeout(resolve, 100));

      // Use html2canvas on the temporary container
      const { default: html2canvas } = await import('html2canvas');
      
      const canvas = await html2canvas(tempContainer, {
        backgroundColor: '#f9fafb',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        width: 1200,
        height: 800,
      });

      // Clean up
      document.body.removeChild(tempContainer);
      
      // Download
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = 'chatbot-flow.png';
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
      }, 'image/png', 1.0);

      // Reset button state
      button.textContent = originalText;
      button.disabled = false;

    } catch (error) {
      console.error('Error exporting image:', error);
      alert('Failed to export image. Please try again.');
      
      // Reset button state on error
      const button = document.activeElement;
      if (button) {
        button.textContent = 'Export PNG';
        button.disabled = false;
      }
    }
  };

  return (
    <div className="space-x-2">
      <button
        onClick={handleExportJSON}
        className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
      >
        Export JSON
      </button>
      <button
        onClick={handleExportImage}
        className="px-4 py-2 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 transition disabled:opacity-50"
      >
        Export PNG
      </button>
    </div>
  );
}
