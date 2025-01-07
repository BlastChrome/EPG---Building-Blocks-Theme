document.addEventListener("DOMContentLoaded", () => {
  const contactForms = Array.from(document.querySelectorAll(".convert-form"));
  // const kitEndPoint = "https://app.kit.com/forms/7290453/subscriptions";
  // Exit if no forms are found
  if (!contactForms.length) return;

  // Iterate over each form
  contactForms.forEach((contactForm) => {
    if (contactForm.id == "captchaForm") return false;

    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      // Capture form data
      const formData = new FormData(contactForm);

      // Get the email value, note the correct field name "contact[email]"
      const email = formData.get("contact[email]");

      // ConvertKit API key and form ID
      const apiKey = "7BkYhDO6DdvssOUZqtC8cw";
      const formId = "7290453";

      try {
        const response = await fetch(
          `https://api.convertkit.com/v3/forms/${formId}/subscribe`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              api_key: apiKey,
              email: email,
            }),
          }
        );

        const data = await response.json();

        if (response.ok) {
          console.log("Success:", data);
        } else {
          console.error("Error:", data);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    });
  });
});
