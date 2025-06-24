import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpEvent, HttpEventType, HttpHeaders, HttpResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';  
import { Observable, interval, map, switchMap } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.css',
  imports: [ CommonModule, FormsModule, HttpClientModule]

  
})
export class AppComponent {
  title = 'AI';
  inputValue: string = '';
  screenResponse: string ="";
  messages: any[]=[];
  apiUrl = "/api/generate";
  apiResponse: any = "";
  isTitle: boolean = false;
  ngOnInit(): void {
    if (typeof window !== 'undefined') {

      this.handleResize();
      window.addEventListener('resize', () => this.handleResize());

    }
    

  }
  
  toggleLeftPanel(): void {
    if (typeof window !== 'undefined') {
      const leftPanel = document.querySelector('.left-panel') as HTMLElement;
      const hideIcon = document.querySelector('.sidebar-icon.hide') as HTMLElement;
      const unhideIcon = document.querySelector('.sidebar-icon.unhide') as HTMLElement;

      if (leftPanel.style.display === 'none') {
        leftPanel.style.display = 'flex';
        unhideIcon.style.display = 'none';
        hideIcon.style.display = 'block';
      } else {
        leftPanel.style.display = 'none';
        hideIcon.style.display = 'none';
        unhideIcon.style.display = 'block';
      }
    }
  }

  handleResize(): void {
    if (typeof window !== 'undefined') {
      const windowWidth = window.innerWidth;
      const leftPanel = document.querySelector('.left-panel') as HTMLElement;
      const hideIcon = document.querySelector('.sidebar-icon.hide') as HTMLElement;
      const unhideIcon = document.querySelector('.sidebar-icon.unhide') as HTMLElement;

      if (windowWidth <= 768) {
        leftPanel.style.display = 'none';
        hideIcon.style.display = 'none';
        unhideIcon.style.display = 'block';
      } else {
        leftPanel.style.display = 'flex';
        unhideIcon.style.display = 'none';
        hideIcon.style.display = 'block';
      }
    }
  }
  response:any;
  constructor(private http: HttpClient) {}

  async handleResponse(jsonLine: any): Promise<void> {
    
    const message = JSON.parse(jsonLine);
    console.log(message);
    this.apiResponse=message;

    this.messages.push(message.response);

    this.concatenateWithDelay();


  }
 
  async concatenateWithDelay(): Promise<void> {
    this.screenResponse = ''; // Clear existing message
    this.screenResponse = this.formatMessages(this.messages.join(''));

      // await this.delay(500); // Wait for 500 milliseconds before adding the next message
    // }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  onEnterPress(): void {
    this.handleSendButton();
  }

  // clearInputAndResponse() {
  //  this.inputValue = '';
  //  this.screenResponse = 'Please wait ...';
  //  this.messages = [];
  // } 
// clearInputAndResponse() {
//   this.inputValue = '';
//   if(this.inputValue == '') {
//     document.getElementById('insidetext')!.innerHTML = '<img src="https://upload.wikimedia.org/wikipedia/commons/c/c7/Loading_2.gif" alt="Loading" width="100" height="100">';
//   }
//   this.messages = [];
// }

clearInputAndResponse() {
  this.inputValue = '';
  this.messages = [];
  // this.screenResponse = '<img src="https://upload.wikimedia.org/wikipedia/commons/c/c7/Loading_2.gif" alt="Loading" width="100" height="100">';
this.screenResponse = `
    <img src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExOWhtYmJpc3Fva25vMmF2ZG5mYTBhYmNseXdldzJvbnJ3NGJkaWY4OSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/VLxsKOM1epzL8uWwCq/giphy.gif"
         alt="Loading" width="175" height="100" >
`;

}





  getTitle() {
    this.isTitle = true;
    this.inputValue = "give me its title within 10 words";
  }
  createPostData(prompt:string): any {
    const data = {
      "model": "llama3",
      "prompt": prompt,
      "stream": true,
      "context": this.apiResponse.context
    } ;
    console.log("postdata: "+ data);
    return data;

  }


  // list of left pane
  items: string[] = [];
  newItem: string = '';

  addItem() {
    if (this.newItem.trim()) {
      this.items.push(this.newItem);
      this.newItem = ''; // clear the input after adding the item
    }
  }
  startNewChat() {
    this.items = [];
    this.apiResponse = "";
    this.screenResponse = '';
  }

// simplied code
handleSendButton(): void {
  this.handleResponseStream();
}
handleResponseStream():void {
    const postData = this.createPostData(this.inputValue);
    this.newItem = this.inputValue;
    this.addItem();
    this.clearInputAndResponse(); 
  this.http.post(this.apiUrl, postData, {  responseType: 'text' }).subscribe({
        
        next: (response) => {
          this.clearInputAndResponse();
          const jsonLines = response.split('\n');
          
          jsonLines.forEach(async jsonLine => {
            // jsonLine = jsonLine.trim();
            this.handleResponse(jsonLine);
          })
            
        },
        error: (error) => {
          console.error('There was an error!', error);
        }
      });
}
updateUI(message: string){
  console.log("got message:"+ message);
}
formatMessages(input: string): string {
  // Use a regular expression to find "1." or "2." and add a new line before them
  const regex = /(\d\.)/g;
  let result = input.replace(regex, '\n$1');
  result = this.escapeBackticks(result);
  // result = input.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  return result;
}
escapeBackticks(input: string): string {
  return input.replace(/`/g, '');
}
}
