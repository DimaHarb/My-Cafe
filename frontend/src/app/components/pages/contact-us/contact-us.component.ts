import { Component } from '@angular/core';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent {
  formData = {
    name: '',
    email: '',
    message: ''
  };

  successMessage: string = '';

  submitForm() {
    // Simulate sending data to a server (replace this with your actual form submission logic)
    // For demonstration purposes, we'll just log the data to the console
    console.log('Form submitted:', this.formData);

    // Assuming the data is successfully submitted
    this.successMessage = 'Message sent successfully!';

    // Clear the form
    this.formData = {
      name: '',
      email: '',
      message: ''
    };

    // Reset the success message after a few seconds
    setTimeout(() => {
      this.successMessage = '';
    }, 3000);
  }
}
