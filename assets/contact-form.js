/*
    This form will hitch a ride on the default Shopify form
    and add the user's info to the ConvertKit mailing list
    in the background
*/

document.addEventListener("DOMContentLoaded", () => {
  // Get all forms with a specific class (or tag name)
  const contactForms = document.querySelectorAll("form"); // Targets all forms

  // Exit if no forms are found
  if (!contactForms.length) return;

  const kitEndPoint = "https://app.kit.com/forms/7290453/subscriptions";

  // Iterate over each form
  contactForms.forEach((contactForm) => {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault(); // Prevent default form submission

      // Capture form data
      const formData = new FormData(contactForm);

      // Rename 'email' field to 'email_address' for ConvertKit
      if (formData.has("email")) {
        formData.set("email_address", formData.get("email"));
        formData.delete("email"); // Optional: Remove original field
      }

      // Log form data
      console.log("Form submitted!", Object.fromEntries(formData.entries()));

      // Send data to ConvertKit via Ajax
      fetch(kitEndPoint, {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          alert("Success:", data);
          // Handle success (e.g., no client-side action needed)
        })
        .catch((error) => {
          alert("Error:", error);
          // Handle error silently (no client-side action)
        });
    });
  });
});
