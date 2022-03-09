import { ApiTags } from '@nestjs/swagger';
import { Controller, Get, Query } from '@nestjs/common';
import { swService } from './sw.service';


@ApiTags('Star Wars Service')
@Controller('/')
export class SwController {
    constructor(private readonly swService: swService) { }

    @Get('/people/all')
    getPeople(): Promise<any> {
        return this.swService.getPeople();
    }
    @Get('/people/populate')
    getPopulate(): Promise<any> {
        return this.swService.getCountByClimate()
    }
    @Get('/vehicles')
    getVehicules(): Promise<any> {
        return this.swService.getVehicles()
    }
    @Get('/vehicles_by_price')
    getVehiculesByPrice(): Promise<any> {
        return this.swService.getVehiclesByPrice()
    }
    @Get('/vehicles_by_pilot')
    getVehiclesByPilot(@Query('pilot') pilot: string) {
        return this.swService.getVehiclesPilot(pilot)
    }
    @Get('/vehicles_Skywalker')
    getVehiclesSkywalker() {
        return this.swService.getVehiclesPilot('Skywalker')
    }

    //es posible seguir agreando endpoints desde aca
}
