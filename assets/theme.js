document.addEventListener("DOMContentLoaded", () => {
  const contactForms = Array.from(document.querySelectorAll(".convert-form"));

  if (!contactForms.length) return;

  contactForms.forEach((contactForm) => {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      debugger;

      const formData = new FormData(contactForm);
      const email = formData.get("contact[email]");

      try {
        const response = await fetch(
          "https://convert-kit-proxy-server.onrender.com/subscribe",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: email,
            }),
          }
        );

        const data = await response.json();

        if (response.ok) {
          console.log("Subscription successful:", data);
        } else {
          console.error("Subscription failed:", data);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    });
  });
});
