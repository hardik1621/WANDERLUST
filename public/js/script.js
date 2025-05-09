(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
})

let taxSwitch= document.getElementById("switchCheckDefault");
taxSwitch.addEventListener("click",()=>{
 
  document.querySelectorAll(".listing-card").forEach(card => {
    const basePrice = card.querySelector(".price-info");
    const taxPrice = card.querySelector(".tax-info");

    if(taxPrice.style.display!="inline"){
      taxPrice.style.display="inline";
      basePrice.style.display="none";
    }
    else{
      taxPrice.style.display="none";
      basePrice.style.display="inline";
    }
  });
  
});