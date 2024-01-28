import { Injectable } from '@angular/core';
let id:any = localStorage.getItem('id');

@Injectable({
  providedIn: 'root'
})


export class AddObjectService {
    objectInformation = {
        object: {
            name: '',
            picture: '../../../assets/image.png',
            description: "",
            placeId: '',
            userId: "",
        },
        placeInformation: {
          geolocalisation: [],
          floor: "",
          description: "",
          geo: "",
        },

    };
    getObjectInformation() {
      return this.objectInformation;
  }
  }




