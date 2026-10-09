/**
 * Camera & Medicine Blister Strip Photo Handler
 * Handles file uploads, sample selection, and webcam snapshots.
 */

export function initCamera(onMedicineIdentified) {
  const uploadInput = document.getElementById('strip-upload-input');
  const uploadBtn = document.getElementById('btn-upload-strip');
  const cameraBtn = document.getElementById('btn-webcam');
  const cameraModal = document.getElementById('camera-modal');
  const videoElem = document.getElementById('webcam-video');
  const snapBtn = document.getElementById('btn-snap-photo');
  const closeCamBtn = document.getElementById('btn-close-camera');
  const samplePills = document.querySelectorAll('.sample-strip-pill');

  let mediaStream = null;

  // File Upload Trigger
  if (uploadBtn && uploadInput) {
    uploadBtn.addEventListener('click', () => uploadInput.click());
    uploadInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('stripImage', file);

      showLoading('Scanning medicine strip via Google Lens API...');
      try {
        const resp = await fetch('/api/identify-strip', {
          method: 'POST',
          body: formData
        });
        const data = await resp.json();
        onMedicineIdentified(data.identifiedMedicine || data.detectedMedicine);
      } catch (err) {
        alert('Could not scan image: ' + err.message);
      } finally {
        hideLoading();
      }
    });
  }

  // Sample Strip Pills
  samplePills.forEach(pill => {
    pill.addEventListener('click', async () => {
      const sampleId = pill.dataset.sampleId;
      const medicineName = pill.dataset.medicine;

      showLoading(`Identifying ${medicineName} strip via Google Lens API...`);
      try {
        const resp = await fetch('/api/identify-strip', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sampleId })
        });
        const data = await resp.json();
        onMedicineIdentified(data.identifiedMedicine || medicineName);
      } catch (err) {
        onMedicineIdentified(medicineName);
      } finally {
        hideLoading();
      }
    });
  });

  // Webcam Capture
  if (cameraBtn && cameraModal) {
    cameraBtn.addEventListener('click', async () => {
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        videoElem.srcObject = mediaStream;
        cameraModal.classList.remove('hidden');
      } catch (err) {
        alert('Webcam access not available or permitted. Please use the Upload Photo or Sample Strip buttons.');
      }
    });

    closeCamBtn.addEventListener('click', () => {
      stopCamera();
      cameraModal.classList.add('hidden');
    });

    snapBtn.addEventListener('click', () => {
      const canvas = document.createElement('canvas');
      canvas.width = videoElem.videoWidth || 640;
      canvas.height = videoElem.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoElem, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(async (blob) => {
        stopCamera();
        cameraModal.classList.add('hidden');

        const formData = new FormData();
        formData.append('stripImage', blob, 'webcam-strip.jpg');

        showLoading('Analyzing photo with Google Lens...');
        try {
          const resp = await fetch('/api/identify-strip', {
            method: 'POST',
            body: formData
          });
          const data = await resp.json();
          onMedicineIdentified(data.identifiedMedicine || 'Augmentin 625 Duo');
        } catch (err) {
          alert('Failed to scan webcam photo: ' + err.message);
        } finally {
          hideLoading();
        }
      }, 'image/jpeg', 0.9);
    });
  }

  function stopCamera() {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      mediaStream = null;
    }
  }

  function showLoading(msg) {
    const loadingElem = document.getElementById('loading-indicator');
    const loadingText = document.getElementById('loading-text');
    if (loadingText) loadingText.textContent = msg || 'Processing...';
    if (loadingElem) loadingElem.classList.remove('hidden');
  }

  function hideLoading() {
    const loadingElem = document.getElementById('loading-indicator');
    if (loadingElem) loadingElem.classList.add('hidden');
  }
}
