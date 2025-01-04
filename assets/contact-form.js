/*
    This form will hitch a ride on the default Shopify form
    and add the user's info to the ConvertKit mailing list
    in the background
*/

document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.getElementById("ContactForm");
  if (!contactForm) return; // Exit if the form doesn't exist

  const kitEndPoint = "https://app.kit.com/forms/7290453/subscriptions";

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault(); // Prevent default form submission

      // Capture form data
      const formData = new FormData(contactForm);

      // Rename 'email' field to 'email_address' for ConvertKit
      if (formData.has("email")) {
        formData.set("email_address", formData.get("email"));
        formData.delete("email"); // Optional: Remove original field
      }

      // Example of how to log the data or send it via Ajax
      console.log("Form submitted!", Object.fromEntries(formData.entries()));

      // Send data to ConvertKit via Ajax
      fetch(kitEndPoint, {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Success:", data);
          // Handle success (e.g., show success message)
        })
        .catch((error) => {
          console.error("Error:", error);
          // Handle error (e.g., show error message)
        });
    });
  }
});
