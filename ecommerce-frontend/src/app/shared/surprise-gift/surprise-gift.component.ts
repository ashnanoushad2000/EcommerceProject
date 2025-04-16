import {
  Component,
  Input,
  Output,
  EventEmitter,
  AfterViewInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import confetti from 'canvas-confetti';
import { Router } from '@angular/router';

@Component({
  selector: 'app-surprise-gift',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './surprise-gift.component.html',
  styleUrls: ['./surprise-gift.component.css']
})
export class SurpriseGiftComponent implements AfterViewInit {
  @Input() visible = false;
  @Input() gift = '';
  @Output() closed = new EventEmitter<void>();

  giftRevealed = false;
  fadingOut = false;

  private confettiCanvas: HTMLCanvasElement | null = null;

  constructor(private router: Router) {}

  ngAfterViewInit(): void {
    this.confettiCanvas = document.getElementById(
      'confetti-canvas'
    ) as HTMLCanvasElement;

    if (this.confettiCanvas) {
      this.confettiCanvas.width = window.innerWidth;
      this.confettiCanvas.height = window.innerHeight;
    }
  }

  // ✅ Closes popup immediately
  closePopup() {
    this.closed.emit();
  }

  // ✅ Trigger confetti and reveal gift
  revealGift() {
    this.giftRevealed = true;

    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
      zIndex: 99999
    });
  }

  // ✅ Handles Claim Now → fade out + navigate after delay
  claimGift() {
    this.fadingOut = true;

    setTimeout(() => {
      this.closePopup();
      this.router.navigate(['/products']);
    }, 1500); // ⏳ delay for fade animation
  }
}
