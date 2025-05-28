document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const loader = document.getElementById('loader');
    const content = document.getElementById('content');
    const navBtns = document.querySelectorAll('.nav-btn');
    const collections = document.querySelectorAll('.collection');
    const hawaiiGrid = document.getElementById('hawaii-grid');
    const birthdayGrid = document.getElementById('birthday-grid');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const caption = document.getElementById('caption');
    const imageCounter = document.getElementById('imageCounter');
    const closeBtn = document.getElementById('closeBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const shareBtn = document.getElementById('shareBtn');

    // State variables
    let currentCollection = 'hawaii';
    let currentImages = [];
    let currentImageIndex = 0;
    let imagesLoaded = 0;
    let totalImagesToLoad = 0;

    // Updated image data with new directories and names
    const imageData = {
        hawaii: Array.from({ length: 8 }, (_, i) => ({
            src: `hawaii/picture (${i + 1}).jpg`,
            caption: `Hawaii Picture ${i + 1}`
        })),
        birthday: Array.from({ length: 8 }, (_, i) => ({
            src: `birthday/picture (${i + 1}).jpg`,
            caption: `Birthday Picture ${i + 1}`
        }))
    };

    function initGallery() {
        loader.style.display = 'flex';
        content.style.display = 'none';

        hawaiiGrid.innerHTML = '';
        birthdayGrid.innerHTML = '';

        totalImagesToLoad = imageData.hawaii.length + imageData.birthday.length;
        imagesLoaded = 0;

        loadCollection('hawaii', hawaiiGrid);
        loadCollection('birthday', birthdayGrid);

        currentImages = imageData[currentCollection];
    }

    function loadCollection(collectionName, gridElement) {
        imageData[collectionName].forEach((image, index) => {
            createGalleryItem(image, gridElement, index, collectionName);
        });
    }

    function createGalleryItem(image, container, index, collection) {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';

        const img = new Image();
        img.src = image.src;
        img.alt = image.caption;
        img.className = 'gallery-img';

        img.onload = function() {
            handleImageLoad();
        };

        img.onerror = function() {
            if (this.src.includes('placeholder.jpg')) return;
            this.src = 'placeholder.jpg';
            this.alt = 'Image not available';
            handleImageLoad();
        };

        galleryItem.appendChild(img);
        container.appendChild(galleryItem);

        galleryItem.addEventListener('click', () => {
            openLightbox(collection, index);
        });
    }

    function handleImageLoad() {
        imagesLoaded++;
        if (imagesLoaded >= totalImagesToLoad) {
            setTimeout(() => {
                loader.style.display = 'none';
                content.style.display = 'block';
                setTimeout(() => {
                    content.classList.add('loaded');
                }, 50);
            }, 500);
        }
    }

    function openLightbox(collection, index) {
        currentCollection = collection;
        currentImages = imageData[collection];
        currentImageIndex = index;
        updateLightbox();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function updateLightbox() {
        if (!currentImages.length || currentImageIndex < 0 || currentImageIndex >= currentImages.length) return;

        const currentImage = currentImages[currentImageIndex];
        lightboxImg.src = currentImage.src;
        caption.textContent = currentImage.caption;
        imageCounter.textContent = `${currentImageIndex + 1} / ${currentImages.length}`;
    }

    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const collection = btn.dataset.collection;

            navBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            collections.forEach(col => col.classList.remove('active'));
            document.getElementById(`${collection}-collection`).classList.add('active');

            currentCollection = collection;
            currentImages = imageData[collection];
            currentImageIndex = 0;
        });
    });

    closeBtn.addEventListener('click', closeLightbox);

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    downloadBtn.addEventListener('click', () => {
        if (!currentImages.length) return;

        const link = document.createElement('a');
        link.href = currentImages[currentImageIndex].src;
        link.download = `image-${currentImageIndex + 1}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    shareBtn.addEventListener('click', () => {
        if (!currentImages.length) return;

        if (navigator.share) {
            navigator.share({
                title: currentImages[currentImageIndex].caption,
                text: 'Check out this photo!',
                url: currentImages[currentImageIndex].src
            }).catch(err => {
                console.error('Error sharing:', err);
            });
        } else {
            alert('Web Share API not supported in your browser');
        }
    });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;

        switch (e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                navigateLightbox(-1);
                break;
            case 'ArrowRight':
                navigateLightbox(1);
                break;
        }
    });

    function navigateLightbox(direction) {
        if (!currentImages.length) return;

        currentImageIndex = (currentImageIndex + direction + currentImages.length) % currentImages.length;
        updateLightbox();
    }

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    initGallery();
});
