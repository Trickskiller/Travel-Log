import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthentificationService } from 'src/app/services/authentification.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  formulaires!: any;
  submitted: boolean = false;

  form!: FormGroup;
  isTypePassword: boolean = true;
  constructor(
    private fb: FormBuilder,
    private service: AuthentificationService,
    private toastController: ToastController

  ) {}

  ngOnInit() {
    this.initForm();
    this.formulaires = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }
  get userName() {
    return this.formulaires.get('username');
  }
  get password() {
    return this.formulaires.get('password');
  }

  login() {
    if (this.formulaires.invalid) {
      this.formulaires.markAllAsTouched();
    } else {
      this.submitted = true;
      this.service.login(this.formulaires.value).subscribe({
        next: (value) =>{},
        error: (err) => {console.error('Observable emitted an error: ' + err), this.submitted = false, this.presentToast()},
        complete: () => (this.submitted = false),
      });
    }
  }
  async presentToast() {
    const toast = await this.toastController.create({
      message: "Mots de passe ou noms d'utilisateur incorect",
      duration: 1500,
      position: "top",
    });

    await toast.present();
  }


  initForm() {
    this.form = new FormGroup({
      email: new FormControl('',
        {validators: [Validators.required, Validators.email]}
      ),
      password: new FormControl('',
        {validators: [Validators.required, Validators.minLength(8)]}
      ),
    });
  }

  onChange() {
    this.isTypePassword = !this.isTypePassword;
  }

  onSubmit() {
    if(!this.form.valid) return;
  }
}
