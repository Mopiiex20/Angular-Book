import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
    selector: '[gool]'
})
export class HighlightDirective {
    constructor(private el: ElementRef) { }

    @HostListener('mouseenter') onMouseEnter() {
        console.log('Touch me');
        this.highlight('green');

    }

    @HostListener('mouseleave') onMouseLeave() {

        this.highlight(null);

    }

    private highlight(color: string) {
        this.el.nativeElement.style.backgroundColor = color;
    }
}