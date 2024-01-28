import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  Camera,
  CameraResultType,
  CameraSource,
  ImageOptions,
  Photo,
} from '@capacitor/camera';
import { ModalController, ToastController } from '@ionic/angular';
import { AddObjectService } from 'src/app/services/addObject.service';
import * as L from 'leaflet';

import { ImageService } from 'src/app/services/upload.service';
import { ObjectService } from 'src/app/services/object.service';
import { AuthentificationService } from 'src/app/services/authentification.service';
import { IonModal } from '@ionic/angular';
import { PlaceService } from 'src/app/services/place.service';
@Component({
  selector: 'app-add-object',
  templateUrl: './add-object.component.html',
  styleUrls: ['./add-object.component.scss'],
})
export class AddObjectComponent implements OnInit {
  @ViewChild(IonModal) modal!: IonModal;
  maps!: L.Map;

  image: any;
  submittedImg: boolean = false;
  submitted: boolean = false;
  deleteState: boolean = false;
  formsubmitted: boolean = false;
  cart: boolean = false;
  data: any;
  form!: any;
  ref: any;
  forms!: any;
  formulaires: any;
  status!: any;
  imageSrc!: any;
  isModalOpen = false;
  locations!: any;
  stage!: any;
  temporaile: any[]=[]
  tripes!: any;
  userName!: any;
  public pages: any[] = [
    { title: 'Voyage', url: '/home/home', icon: 'airplane' },

    { title: 'Compte', url: '/home/profile', icon: 'person' },

    { title: 'Deconnexion', url: '', icon: 'log-out', route: true },
  ];
  constructor(
    private service: ImageService,
    private services: ObjectService,
    private places: PlaceService,
    private fb: FormBuilder,
    private object: AddObjectService,
    private router: Router,
    private toastController: ToastController,
    private log: AuthentificationService,
    private modalCtrl: ModalController

  ) {}

  ngOnInit() {
    this.formulaires = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      placesCount: [10],
      userId: [''],
      userHref: [''],
    });
    this.userName = JSON.parse(this.log.userName)


    this.forms = this.fb.group({
      name: ['', Validators.required],
      description: ['Reference site about Lorem Ipsum'],
      position: [{value: '', disabled: true}],
      location: this.fb.group({
        type: ['Point'],
        coordinates: ['', Validators.required],
      }),
      tripHref: [''],
      tripId: [''],
      pictureUrl: ['', Validators.required],
    });

    this.status = this.log.id;
    this.ref = localStorage.getItem('ref');
  }

  get title() {
    return this.formulaires.get('title');
  }

  get description() {
    return this.formulaires.get('description');
  }
  get placesCount() {
    return this.formulaires.get('placesCount');
  }

  get name() {
    return this.forms.get('name');
  }

  get descriptionPlace() {
    return this.forms.get('description');
  }
  get location() {
    return this.forms.get('location');
  }

  get pictureUrl() {
    return this.forms.get('pictureUrl');
  }

  async takePicture() {
    // Prepare camera options.
    const options: ImageOptions = {
      quality: 20,
      resultType: CameraResultType.Base64,
      allowEditing: false,
    };

    const pictureDataPromise = await Camera.getPhoto(options);

    this.submittedImg = true;
    const data = await this.service.upload(pictureDataPromise).subscribe({
      next: (value) => {
        console.log(value);
        this.imageSrc = value.data.url;
        this.forms.get('pictureUrl').setValue(value.data.url);
      },
      error: (err) => {
        this.presentToast("Nous rencontrons une erreur pour enregistrer votre image");

        console.error('Observable emitted an error: ' + err),
          (this.submittedImg = false);
      },
      complete: () => (this.submittedImg = false),
    });
  }

  logout() {
    this.log.logout();
  }

  save() {
    console.log(this.formulaires.invalid)
    console.log(this.title)
    if (this.formulaires.invalid) {
      this.formulaires.markAllAsTouched();
    } else {
      this.formulaires.get('userId').setValue(JSON.parse(this.status));
      this.formulaires.get('userHref').setValue(JSON.parse(this.ref));
      this.stage = 'etape 2';
    }
  }
  voyage(){

    if(this.tripes){

      this.presentToast('voyage enregistrée avec succées');
        this.isModalOpen = true;

    }else{
      this.presentToast('enregistrez un lieu');

    }

  }

  enregistrer() {
    if (this.forms.invalid) {
      this.forms.markAllAsTouched();
    } else {
      this.submitted = true
      if (this.tripes) {
        console.log('with stage');
        this.forms.get('location.type').setValue("Point");
        this.forms.get('description').setValue("Reference site about Lorem Ipsum");

        this.forms.get('tripId').setValue(this.tripes.id);
        this.forms.get('tripHref').setValue(this.tripes.href);
        this.places.create(this.forms.value).subscribe({
          next: (value: any) => {
            this.temporaile.push(value);

          },
          error: (err) => {
            console.error('Observable emitted an error: ' + err),
              this.presentToast('Nous rencontrons une erreur'),
              (this.submitted = false);
          },
          complete: () => {
            this.submitted = false;
            this.forms.reset();
            this.imageSrc = "";
            this.cancel();
            this.presentToast('place enregistré avec succées');
          },
        });
      } else {
        this.submitted = true;
        this.services.create(this.formulaires.value).subscribe({
          next: (value: any) => {
            this.forms.get('tripId').setValue(value.id);
            this.forms.get('tripHref').setValue(value.href);
            this.tripes = value;
            this.places.create(this.forms.value).subscribe({
              next: (value: any) => {
                this.temporaile.push(value);

              },
              error: (err) => {
                console.error('Observable emitted an error: ' + err),
                  this.presentToast('Nous rencontrons une erreur'),
                  (this.submitted = false);
              },
              complete: () => {
              },
            });
          },
          error: (err) => {
            console.error('Observable emitted an error: ' + err),
              this.presentToast('Nous rencontrons une erreur'),
              (this.submitted = false);
          },
          complete: () => {
            this.submitted = false;
            this.forms.reset();
            this.imageSrc = "";
            this.cancel();
            this.presentToast('place enregistrée avec succées');
          },
        });
      }
    }
  }

  loadMap() {
    this.maps = L.map('map').setView([46.781231, 6.6447348], 100);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.maps);
    this.maps.on('click', (event: L.LeafletMouseEvent) => {
      const latlng = event.latlng;
      let temp = [];
      temp.push(latlng.lng, latlng.lat);
      this.forms.get('location.coordinates').setValue(temp);

      // Faites ce que vous voulez avec les coordonnées ici
    });

    setTimeout(() => {
      this.maps.invalidateSize();
    }, 0);
  }
  delete(data:any){
    this.deleteState= true
    this.places.delete(data).subscribe({
      next: (value: any) => {
        this.temporaile = this.temporaile.filter(item => item.id !== data.id);


      },
      error: (err) => {
        console.error('Observable emitted an error: ' + err),
          this.presentToast('Nous rencontrons une erreur'),
          (    this.deleteState= false
            );
      },
      complete: () => {
        this.presentToast("Place supprimée avec succée")
        this.deleteState= false

      },
    });


  }
  async presentToast(message: any) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: 'top',
    });

    await toast.present();
  }

  annuler() {
    this.modal.dismiss();
  }

  async open() {
    await this.modal.present();
    await this.loadMap();
  }
  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {}


  async getCityCoordinates(cityName:any) {

    console.log(cityName.detail.value);
    const apiUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityName.detail.value.toLowerCase())}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    console.log(data);

    if (data && data.length > 0) {
      console.log(data, "value");
      this.locations = data[0].display_name
      const coordinates:any = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
      const coordinates2 = [parseFloat(data[0].lon), parseFloat(data[0].lat)];
      this.maps.flyTo(coordinates, 13, { duration: 2 }); // Animation de 2 secondes
      this.forms.get('location.coordinates').setValue(coordinates2);

      return coordinates;
    } else {
      throw new Error("Coordonnées de la ville introuvables");
    }
  }
      async redirect(){
        this.isModalOpen = false;
      await  this.modalCtrl.dismiss();

        this.router.navigate(['/home']);


      }

      async redirectedit(){
        this.isModalOpen = false;
      await  this.modalCtrl.dismiss();

        this.router.navigate(['/home/edit',this.tripes.id]);


      }


}
