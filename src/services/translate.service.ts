import { Injectable } from "@angular/core";
import { TranslateService } from "ng2-translate";

@Injectable()
export class TranslateServiceLocal
{
	constructor( private translateService: TranslateService )
	{

	}

	public translate( messageToTranslate: string ): string
	{
		let message: string;
		this.translateService.get( messageToTranslate ).subscribe( value => 
		{
			message = value;
		} );

		return message;
	}
}