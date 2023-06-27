function previewImage(event) {
    let input = event.target;

    if (input.files && input.files[0]) {
        let reader = new FileReader();
        reader.onload = function (e) {
            let imagePreview = document.getElementById("image-preview");
            imagePreview.src = e.target.result;
            imagePreview.style.display = "block";
        };
        reader.readAsDataURL(input.files[0]);
    }
}
