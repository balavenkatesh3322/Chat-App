app.service('accidentReportService', function($http) {

    this.getAccidentReportByNumber = function(accid) {
        return $http({
            method: 'POST',
            url: "/get_accident_report_by_no/",
            data: {
                "accid": accid
            }
        });
    }
    this.saveAccidentReportMainForm = function(formData) {
        console.log(formData, "service calling")
        return $http({
            method: 'POST',
            url: "/save_accident_report_master/",
            data: formData
        });
    }
    this.getAccidentPortNames = function(portcode) {
        return $http({
            method: 'POST',
            url: "/get_accident_portcode/",
            data: portcode,
        })
    }

    this.generateAccidentExportExcel = function(formData) {
        return $http({
            method: 'POST',
            url: "/Accident_Report_Export_excel/",
            responseType: 'arraybuffer',
            data: formData,
        });
    }

    this.generateAccidentExportPdf = function(formData) {
        return $http({
            method: 'POST',
            url: "/accident-report-form-save-as-pdf/",
            responseType: 'arraybuffer',
            data: formData,
        });
    }

    this.deleteAccidentReportMainForm = function(formData) {
        return $http({
            method: 'POST',
            url: "/delete_accident_report_master/",
            data: formData
        });
    }
    this.getTotalCrews = function(curDate, offset,vesselcode) {
        return $http({
            method: 'POST',
            url: "/get_accident_total_crewList/?offset=" + offset+"&vesselcode="+vesselcode,
            data: curDate
        })
    }
});