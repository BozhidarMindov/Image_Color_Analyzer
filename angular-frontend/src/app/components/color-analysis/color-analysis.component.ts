import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ColorDataService} from "../../services/color-data.service";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: 'app-color-analysis',
  templateUrl: './color-analysis.component.html',
  styleUrls: ['./color-analysis.component.scss']
})
export class ColorAnalysisComponent implements OnInit {
  colorData: any[] = [];
  imageIdentifier: string | null = null;
  username: string | null = null
  imageUrl: string | undefined

  constructor(private router: Router, private route: ActivatedRoute, private colorDataService: ColorDataService, private authService: AuthService) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const imageIdentifier = params['imageIdentifier'];
      const username = params['username']
      if (imageIdentifier && username) {
        this.imageIdentifier = imageIdentifier;
        this.username = username

        this.colorDataService.getColorDataByImageIdentifier(imageIdentifier).subscribe(
          (data) => {
            // @ts-ignore
            this.colorData = data["colorData"]
            // @ts-ignore
            this.imageUrl = data["imageUrl"];
          },
          () => {
            this.router.navigate([`/color-results/${username}`]);
          }
        );
      } else {
        // Redirect to color results if imageUrl is not provided
        this.router.navigate([`/color-results/${username}`]);
      }
    });
  }

  analyzeAnotherImage(): void {
    this.router.navigate(['/']);
  }
}
