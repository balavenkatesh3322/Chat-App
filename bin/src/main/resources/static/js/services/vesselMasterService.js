app.service('vesselMasterService', function($http) {
    this.getVesselMasterFlags = function() {
        return $http({
            method: 'GET',
            url: "/get-vessel-master-flags/",
        })
    }

    this.getVesselMasterPortNames = function(portcode) {
    	 console.log("Port code >>>>>>. "+portcode);
        return $http({
            method: 'POST',
            url: "/get-vessel-master-portnames/",
            data : portcode,
        })
    }

    this.getVesselTypes = function() {
        return $http({
            method: 'GET',
            url: "/get-vessel-type-master/",
        })
    }

    this.getVesselMasterFleetManagers = function() {
        return $http({
            method: 'GET',
            url: "/get-user-as-fleet-manager/",
        })
    }

    this.getVesselMasterSuperintendent = function() {
        return $http({
            method: 'GET',
            url: "/get-user-as-superintendent/",
        })
    }

    this.getVesselMasterFleetGM = function() {
        return $http({
            method: 'GET',
            url: "/get-user-as-fleet-gm/",
        })
    }


    this.getVesselMasterHseqManager = function() {
        return $http({
            method: 'GET',
            url: "/get-user-as-hseq-manager/",
        })
    }

    this.getVesselMasterHseqSI = function() {
        return $http({
            method: 'GET',
            url: "/get-user-as-hseq-si/",
        })
    }

    this.getVesselMasterMarineManagers = function() {
        return $http({
            method: 'GET',
            url: "/get-user-as-marine-manager/",
        })
    }

    this.getVesselMasterMarineSI = function() {
        return $http({
            method: 'GET',
            url: "/get-user-as-marine-si/",
        })
    }

    this.getVesselMasterPurchaser = function() {
        return $http({
            method: 'GET',
            url: "/get-user-as-purchaser/",
        })
    }

    this.getVesselMasterAccountant = function() {
        return $http({
            method: 'GET',
            url: "/get-user-as-accountant/",
        })
    }

    this.getVesselMasterCrewInCharge = function() {
        return $http({
            method: 'GET',
            url: "/get-user-as-crew-in-charge/",
        })
    }

    this.getVesselMasterInvoicer = function() {
        return $http({
            method: 'GET',
            url: "/get-user-as-invoicer/",
        })
    }

    this.getVesselMasterRanks = function() {
        return $http({
            method: 'GET',
            url: "/get-vessel-master-ranks/",
        })
    }

    this.getVesselMasterFleets = function() {
        return $http({
            method: 'GET',
            url: "/get-vessel-master-fleets/",
        })
    }

    this.getVesselMasterEmployees = function() {
        return $http({
            method: 'GET',
            url: "/get-vessel-master-superintendents/",
        })
    }

    this.getVesselMasterShorecodes = function() {
        return $http({
            method: 'GET',
            url: "/get-vessel-master-shorecodes/",
        })
    }

    this.getCurrencyCodes = function() {
        return $http({
            method: 'GET',
            url: "/get-currency-codes/",
        })
    }

    this.getAuxEngineEqp = function() {
        return $http({
            method: 'GET',
            url: "/get-aux-engine-eqp/",
        })
    }

    this.getAuxMachineEqp = function() {
        return $http({
            method: 'GET',
            url: "/get-aux-machine-eqp/",
        })
    }

    this.getVesselNavEqp = function() {
        return $http({
            method: 'GET',
            url: "/get-vessel-nav-eqp/",
        })
    }

    this.getVesselMasterSavedData = function(vesselcode) {
        return $http({
            method: 'POST',
            url: "/get-vessel-master-saved-data/",
            data: vesselcode
        })
    }


    this.getExVesselNames = function(vesselcode) {
        return $http({
            method: 'POST',
            url: "/get-ex-vessel-names/",
            data: vesselcode
        })
    }

    this.getExVesselManagement = function(vesselcode) {
        return $http({
            method: 'POST',
            url: "/get-ex-vessel-management/",
            data: vesselcode
        })
    }

    this.getAuxEngineSavedEqp = function(vesselcode) {
        return $http({
            method: 'POST',
            url: "/get-aux-engine-eqps/",
            data: vesselcode
        })
    }

    this.getAuxMachineSavedEqp = function(vesselcode) {
        return $http({
            method: 'POST',
            url: "/get-aux-machine-eqps/",
            data: vesselcode
        })
    }

    this.getVesselNavigations = function(vesselcode) {
        return $http({
            method: 'POST',
            url: "/get-vessel-navigations/",
            data: vesselcode
        })
    }

    this.getVesselMasterForms = function() {
        return $http({
            method: 'GET',
            url: "/get-vessel-master-forms/",
        })
    }

    this.saveVesselMasterCompositeForm = function(formData) {
        return $http({
            method: 'POST',
            url: "/save-composite-vessel-master-data/",
            data: formData
        });
    }
    this.getNationalityRating = function(vesselcode) {
       return $http({
           method: 'GET',
           url: "/get_nationality_rating_for_vessel/?vesselcode="+vesselcode,
       })
   }
    this.getTotalcrews = function(vesselcode) {
        return $http({
            method: 'GET',
            url: "/get_total_crews_for_vessel/?vesselcode="+vesselcode,
        })
    }
    
    this.exportVesselMasterCompositeForm = function(formData){
		return	$http({
			method: 'POST',
  	        url: "/export-composite-vessel-master-data/",
   	        responseType: 'arraybuffer',
   	        data: formData,
		});
}
    
    
    this.exportVesselMasterCompositeForm1 = function(formData) {
        return $http({
            method: 'POST',
            url: "/VesselPerticular-Export-excel/",
            responseType: 'arraybuffer',
            data: formData
        });
    }

});
