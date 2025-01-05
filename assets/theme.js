document.addEventListener("DOMContentLoaded", () => {
  const contactForms = Array.from(document.querySelectorAll("form"));
  const kitEndPoint = "https://app.kit.com/forms/7290453/subscriptions";
  // Exit if no forms are found
  if (!contactForms.length) return;

  // Iterate over each form
  contactForms.every((contactForm) => {
    if (contactForm.id == "captchaForm") return false;

    contactForm.addEventListener("submit", (e) => {
      debugger;
      e.preventDefault();

      // Capture form data
      const formData = new FormData(contactForm);

      // Convert Shopify 'email' to ConvertKit 'email_address'
      formData.set("email_address", formData.get("email"));
      formData.delete("email");

      // Submit the form via Fetch API
      fetch(kitEndPoint, {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          if (
            response.headers.get("content-type")?.includes("application/json")
          ) {
            return response.json();
          } else {
            return response.text(); // Handle non-JSON responses
          }
        })
        .then((data) => {
          if (typeof data === "string") {
            alert("Received HTML response:", data);
            console.log("Thank you for subscribing!");
          } else {
            console.log(data);
            alert("Success:", data);
            console.log("Thank you for subscribing!");
          }
        })
        .catch((error) => {
          alert("Error:", error);
          console.log("There was a problem. Please try again.");
        });
    });
  });
});
