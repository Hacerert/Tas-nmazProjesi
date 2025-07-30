import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tasinmaz-edit',
  templateUrl: './tasinmaz-edit.component.html',
  styleUrls: ['./tasinmaz-edit.component.css']
})
export class TasinmazEditComponent implements OnInit {
  tasinmazForm!: FormGroup;
  message: string = '';
  isSuccess: boolean = false;

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.tasinmazForm = this.fb.group({
      il: ['', Validators.required],
      ilce: ['', Validators.required],
      mahalle: ['', Validators.required],
      ada: ['', Validators.required],
      parsel: ['', Validators.required],
      nitelik: ['', Validators.required]
    });
    // Burada mevcut taşınmaz verilerini de forma set edebilirsin
  }

  onSubmit(): void {
    if (this.tasinmazForm.valid) {
      // Güncelleme işlemi burada yapılacak
      this.message = 'Taşınmaz başarıyla güncellendi!';
      this.isSuccess = true;
    } else {
      this.message = 'Lütfen tüm alanları doldurun.';
      this.isSuccess = false;
    }
  }

  cancel(): void {
    this.router.navigate(['/tasinmazlar']);
  }
}
