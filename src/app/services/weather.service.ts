import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
 
  private baseUrl = 'https://api.openweathermap.org/data/2.5/weather';
  private apiKey = '0b2de56723f9c78d1ed535ae54e3e753';
  
  constructor(private http: HttpClient) { }

  getWeather(city: string): Observable<any>{
    const url = `${this.baseUrl}?q=${city}&appid=${this.apiKey}&units=metric`;
    return this.http.get(url);
  }
}
