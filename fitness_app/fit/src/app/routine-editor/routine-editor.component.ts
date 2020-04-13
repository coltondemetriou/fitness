import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { RoutineEditorService } from '../routine-editor.service';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { stringify } from 'querystring';
import { parseI18nMeta } from '@angular/compiler/src/render3/view/i18n/meta';


@Component({
  selector: 'app-routine-editor',
  templateUrl: './routine-editor.component.html',
  styleUrls: ['./routine-editor.component.css']
})
export class RoutineEditorComponent implements OnInit {
  @ViewChild('theExercise') theExercise: ElementRef;
  @ViewChild('nameError') nameError: ElementRef;
  @ViewChild('routineName') routineName: ElementRef;

  constructor(
    private routineEditorService: RoutineEditorService,
    private router: Router,
    private http: HttpClient
  ) { }

  /* addToRoutine using the service
  addToRoutine(exercise) {
    this.routineEditorService.addToRoutine(exercise);
    window.alert('Exercise added!')
  } */

  presetRoutineName = '';
  exercises = [];

  // If the routine name is empty, display the error message. Otherwise, hide it. ARROW FUNCTION ERROR MESSAGES
  nameValidation = () => {
    var name = this.routineName.nativeElement.value;
    var errorMessage = this.nameError.nativeElement;

    if (name.length == 0) {
      errorMessage.style.display = "inline";
    }
    else {
      errorMessage.style.display = "none";
    }
  }

  // Add exercise to exercise list DOM MANIPULATION - CLEARING THE FORM
  addToRoutine(exercise) {
    exercise = exercise.trim();
    if (exercise.length != 0) {
      this.exercises.push(exercise);
      this.theExercise.nativeElement.value = "";
    }
  }

  // Save routine and redirect to routines page ANONYMOUS FUNCTION DOM MANIPULATION
  saveRoutine = function(form: any) {
    var name = this.routineName.nativeElement.value;
    if (name.length == 0) {
      window.alert("Please enter a routine name.");
    }
    else {
      // Save the routine to the backend, attaching user information as well.

      // Set the form's exercise to be the exercises array
      form.exercise = JSON.stringify(this.exercises);
      
      // Convert form into parameters
      let parameters = new FormData();
      parameters.append("title", form.title);
      parameters.append("exercise", form.exercise);
      parameters.append("user", 'user1');

      // Send POST request to backend to save the routine
      this.http.post('http://localhost/fitnessphp/save-routine.php', parameters).subscribe( (data) => {
        // If successful
        console.log('Response ', data);
        if (data['content'] == 'Success') {
          window.alert("Routine saved!");
          this.router.navigate(['/routines']);
        }
        // If duplicate routine
        else if (data['content'] == 'Duplicate') {
          window.alert("You already have a routine with this name. Please choose a new name.");
        }
      }, (error) => {
        // If error
        console.log('Error', error);
        window.alert('An error occurred saving your routine. Please try again.')
        location.reload();
      }
      )
    }
  }

  ngOnInit(): void {
    // See if the user is trying to edit a routine
    let params = new URLSearchParams(window.location.search);
    // If the URL has parameters, prepopulate the form
    if (params.has('routine') && params.has('exercises')) {
      // Get title and set prefilled value
      let title = params.get('routine');
      this.presetRoutineName = title;

      // Get exercises
      let exercises = params.get('exercises');
      let exerciseArray = exercises.split(',');

      // Prefill the exercises array
      if (exerciseArray.length != 0) {
        this.exercises = exerciseArray;
      }
      
    }
  }
}
