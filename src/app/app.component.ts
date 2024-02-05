import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { WeatherService } from './services/weather.service';
import { MatCardModule } from "@angular/material/card"
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ 
    CommonModule, 
    RouterOutlet, 
    HttpClientModule, 
    MatCardModule,
    MatDividerModule,
    MatIconModule,
    MatInputModule,
    FormsModule,
    MatFormFieldModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'weather-app'; 
  public temperature?: number;
  public minTemp?: number;
  public maxTemp?: number;
  weather: any;
  backgroundStyle: any;
  city: string = "";


  constructor(private weatherService: WeatherService){}

  ngOnInit(): void {
    this.getWeather('Tokyo');
  }

  getWeather(city: string): void{
    this.weatherService.getWeather(city).subscribe({
      next: (data) => {
        this.weather = data; 
        this.temperature = Math.round(data.main.temp);
        this.minTemp = Math.round(data.main.temp_min);
        this.maxTemp = Math.round(data.main.temp_max);
        const weatherCondition = data.weather[0].main;
        this.updateBackground(weatherCondition);
        console.log('weather data:', data)
      },
      error: (error) => console.error('there was an error!', error)
    });
  }

  updateCity(city: string){
    this.city = city;
    this.getWeather(this.city);
  }

  updateBackground(weatherCondition: string){
    const baseUrl = "assets/";
    let imageName = 'neutral.webp';

    switch (weatherCondition){
      case 'Clouds':
        imageName = 'cloudy.webp';
        break;
      case 'Clear':
        imageName = 'sunny.webp';
        break;
      case 'Rain':
      case 'Drizzle':
        imageName = 'rainy.webp';
        break;
      case 'Snow':
        imageName = "snowy.webp";
        break;
    }

    this.backgroundStyle = {'background-image' : `url(${baseUrl + imageName})`};
  }

}
