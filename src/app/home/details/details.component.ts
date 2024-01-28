import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Animation, AnimationController, IonicSlides } from '@ionic/angular';
import { ObjectService } from 'src/app/services/object.service';
import * as L from 'leaflet';
import { CommonModule, Location } from '@angular/common';
import { PlaceService } from 'src/app/services/place.service';
import { PopoverController,ToastController } from '@ionic/angular';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent  implements OnInit {
  @Input() slides: any[] = [];
  swiperModules = [IonicSlides];
  @ViewChild('swiper')
  swiperRef: ElementRef | undefined;
  @ViewChild('popover') popover:any;
  deleted: boolean = false;

  isOpen = false;

  id!: string;
  submitted: boolean = false;
  data!: any;
  map!: L.Map;
  randomColor!: string;
  isModalOpen = false;
  isModalOpens = false;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: ObjectService,
    private location: Location,
    private placeservice: PlaceService,
    public popoverController: PopoverController,
    private toastController: ToastController,


  ) { }

  ngOnInit() {
  this.id =  this.route.snapshot.params["id"];

  this.getObject()
  }


    getObject() {

      this.submitted = true;
      this.placeservice.getAllO().subscribe({
        next: (value:any) =>{
          this.data = value,
          this.data = this.data.filter((item:any) => item.trip.id === this.id);


        const obj:any = {}

        for (var i = this.data.length - 1; i >= 0; i--) {
          const place = Object.assign({}, this.data[i])
          const { trip } = place
          delete place.trip
          const subObject = obj[trip?.id] || {...trip}
              const placeInObject = subObject?.places || []
              placeInObject.push(place)
              subObject.places = placeInObject
              obj[trip?.id] = subObject
        }
        this.data = Object.values(obj);

        console.log(this.data)
        },
        error: (err) => {console.error('Observable emitted an error: ' + err), this.submitted = false},
        complete: async () => {
          this.submitted = false;
          this.loadMap(this.data);
        },
      });
  }
  onSlideChange(event: any) {
    console.log(this.swiperRef?.nativeElement.swiper.activeIndex);
    console.log('event', event);
  }

  loadMap(x:any) {
    this.map = L.map("map").setView([0, 0], 0);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

      for(let data of x[0].places){
        let temp:any = []
        temp.push(data.location.coordinates[1])
        temp.push(data.location.coordinates[0])

        L.marker(temp).addTo(this.map).bindPopup(data.name);

      }

    setTimeout(() =>{
      this.map.invalidateSize();
    }, 0);
  }
  forward(){
    this.location.back();
  }
  presentPopover(e: Event) {
    this.popover.event = e;
    this.isOpen = true;
  }
  edit(){
    this.popoverController.dismiss();
    this.router.navigateByUrl(`home/edit/${this.id}`);

  }
  setOpen(){
    this.isModalOpen = false;
    this.isModalOpens = false;

    this.isModalOpen = true;
   }
  delete(){

    this.deleted = true;
    this.service.deleteP(this.data[0].id).subscribe({
      next: (value) => console.log(value),
      error: (err) => {
        console.log(err)
        if(err.code === 200){
          this.deleted = false;

          this.presentToast("Object supprimé avec Succées");
          this.isModalOpen = false;
          this.isModalOpens = true;
          this.deleted = false;

        }else{
          this.deleted = false;

          this.presentToast("Nous rencontrons une erreur verifez votre connection et réessayer")

        }

         this.submitted = false},
      complete: () => {
        this.deleted = false;

        this.isModalOpen = false;
        this.isModalOpens = true;
        this.presentToast("Object supprimé avec Succées")
      },
    });
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: "top",
    });

    await toast.present();
  }
  redirect(){
    this.isModalOpen = false;
    this.isModalOpens = false;
    this.router.navigateByUrl("/home");

  }

}
