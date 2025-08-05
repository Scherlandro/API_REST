import {
  Component, ElementRef, OnInit,
  AfterViewInit, ViewChild, ViewEncapsulation, OnDestroy, HostListener
} from '@angular/core';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  encapsulation:ViewEncapsulation.None
})
export class HomeComponent implements AfterViewInit {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  private width = 400;
  private height = 300;
  private mousePos = { x: -100, y: -100 };
  private particles: Particle[] = [];
  private animationId!: number;
  private logos = [
    this.createHtmlLogo(),
    this.createCssLogo(),
    this.createJsLogo()
  ];
  private activeLogo: Particle[] = [];

  ngAfterViewInit(): void {
    this.initCanvas();
    this.createParticles();
    this.animate();
  }

  private initCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    canvas.width = this.width;
    canvas.height = this.height;
  }

  private createParticles(): void {
    // Criar partículas para cada logo
    this.logos.forEach(logoParticles => {
      this.particles = [...this.particles, ...logoParticles];
    });
  }

  private createHtmlLogo(): Particle[] {
    const particles: Particle[] = [];
    const centerX = this.width * 0.25;
    const centerY = this.height * 0.5;
    const size = 80;

    // Formar o logo do HTML (< >)
    for (let i = 0; i < 40; i++) {
      // Partículas para o <
      particles.push(new Particle(
        centerX - size * 0.6 + i * 3,
        centerY - size * 0.4 + i * 2,
        centerX - size * 0.6 + i * 3,
        centerY - size * 0.4 + i * 2,
        '#c99914'
      ));

      // Partículas para o >
      particles.push(new Particle(
        centerX + size * 0.6 - i * 3,
        centerY - size * 0.4 + i * 2,
        centerX + size * 0.6 - i * 3,
        centerY - size * 0.4 + i * 2,
        '#E44D26'
      ));
    }

    return particles;
  }

  private createCssLogo(): Particle[] {
    const particles: Particle[] = [];
    const centerX = this.width * 0.5;
    const centerY = this.height * 0.5;
    const size = 80;

    // Formar o logo do CSS (C com camadas)
    for (let angle = 0; angle < Math.PI * 2; angle += 0.1) {
      const radius = size * 0.8;
      const radius2 = size * 0.5;

      particles.push(new Particle(
        centerX + Math.cos(angle) * radius,
        centerY + Math.sin(angle) * radius,
        centerX + Math.cos(angle) * radius,
        centerY + Math.sin(angle) * radius,
        '#430da1'
      ));

      particles.push(new Particle(
        centerX + Math.cos(angle) * radius2,
        centerY + Math.sin(angle) * radius2,
        centerX + Math.cos(angle) * radius2,
        centerY + Math.sin(angle) * radius2,
        '#5e16ee'
      ));
    }

    return particles;
  }

  private createJsLogo(): Particle[] {
    const particles: Particle[] = [];
    const centerX = this.width * 0.75;
    const centerY = this.height * 0.5;
    const size = 80;

    // Formar o logo do JS (JS com detalhes)
    // Letra J
    for (let i = 0; i < 30; i++) {
      particles.push(new Particle(
        centerX - size * 0.3,
        centerY - size * 0.6 + i * 4,
        centerX - size * 0.3,
        centerY - size * 0.6 + i * 4,
        '#F7DF1E'
      ));
    }

    // Letra S
    for (let angle = Math.PI; angle < Math.PI * 2; angle += 0.2) {
      particles.push(new Particle(
        centerX + size * 0.3 + Math.cos(angle) * size * 0.3,
        centerY + Math.sin(angle) * size * 0.3,
        centerX + size * 0.3 + Math.cos(angle) * size * 0.3,
        centerY + Math.sin(angle) * size * 0.3,
        '#abf71e'
      ));
    }

    return particles;
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    this.mousePos = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };

    // Verificar qual logo está próximo do mouse
    this.activeLogo = [];
    const detectionRadius = 100;

    this.logos.forEach(logo => {
      const logoCenterX = logo[0].originX;
      const logoCenterY = logo[0].originY;
      const distance = Math.sqrt(
        Math.pow(this.mousePos.x - logoCenterX, 2) +
        Math.pow(this.mousePos.y - logoCenterY, 2)
      );

      if (distance < detectionRadius) {
        this.activeLogo = logo;
      }
    });
  }

  private animate(): void {
    this.ctx.fillStyle = 'rgba(15, 23, 42, 0.2)';
    this.ctx.fillRect(0, 0, this.width, this.height);

    this.particles.forEach(particle => {
      // Verificar se a partícula pertence ao logo ativo
      const isActive = this.activeLogo.includes(particle);

      particle.update(this.mousePos, isActive);
      particle.draw(this.ctx);
    });

    this.animationId = requestAnimationFrame(() => this.animate());
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animationId);
  }
}

class Particle {
  private vx = 0;
  private vy = 0;
  private friction = 0.85;
  private isReturning = false;

  constructor(
    public x: number,
    public y: number,
    public originX: number,
    public originY: number,
    public color: string,
    public size: number = 3
  ) {}

  update(mousePos: { x: number, y: number }, isActive: boolean): void {
    const dx = mousePos.x - this.x;
    const dy = mousePos.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (isActive && distance < 150) {
      // Efeito de repulsão quando o mouse está próximo
      const angle = Math.atan2(dy, dx);
      const force = (150 - distance) / 150;

      this.vx += Math.cos(angle) * force * 5;
      this.vy += Math.sin(angle) * force * 5;
      this.isReturning = false;
    } else if (!this.isReturning) {
      // Voltar para a posição original
      const ox = this.originX - this.x;
      const oy = this.originY - this.y;
      const returnSpeed = 0.1;

      this.vx += ox * returnSpeed;
      this.vy += oy * returnSpeed;

      // Verificar se está próximo o suficiente da origem
      if (Math.abs(ox) < 1 && Math.abs(oy) < 1) {
        this.x = this.originX;
        this.y = this.originY;
        this.isReturning = true;
      }
    }

    // Aplicar atrito
    this.vx *= this.friction;
    this.vy *= this.friction;

    // Atualizar posição
    this.x += this.vx;
    this.y += this.vy;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}
