document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("ContactFooter");
  if (form) {
    const newAction = "https://app.kit.com/forms/7290453/subscriptions";
    form.action = newAction;
    // form.addEventListener("submit", function (event) {
    //   event.preventDefault(); // Prevent default Shopify submission

    //   const email = form.querySelector('input[name="contact[email]"]').value;

    //   // Perform ConvertKit form submission
    //   fetch("https://app.kit.com/forms/7290453/subscriptions", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/x-www-form-urlencoded",
    //     },
    //     body: new URLSearchParams({
    //       email: email,
    //     }),
    //   })
    //     .then((response) => response.json())
    //     .then((data) => {
    //       if (data.status === "success") {
    //         // Handle success (show success message, redirect, etc.)
    //         alert("Thank you for subscribing!");
    //       } else {
    //         // Handle errors (display error message, etc.)
    //         alert("Error: Please try again.");
    //       }
    //     })
    //     .catch((error) => console.error("Error:", error));
    // });
  }
});
