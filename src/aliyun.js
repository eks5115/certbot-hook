let Core = require('@alicloud/pop-core');


let client = {};

function Aliyun() {

}

Aliyun.prototype.init = function(accessKeyId, accessKeySecret) {
  client = new Core({
    accessKeyId: accessKeyId,
    accessKeySecret: accessKeySecret,
    endpoint: 'https://alidns.aliyuncs.com',
    apiVersion: '2015-01-09'
  });
};

Aliyun.prototype.domainRecordSize =  function(domainName, callback) {
  let params = {
    "DomainName": domainName
  };

  let requestOption = {
    method: 'POST'
  };

  client.request('DescribeDomainRecords', params, requestOption).then((result) => {
    callback(result.TotalCount);
  }, (ex) => {
    console.log(ex);
  });
};

Aliyun.prototype.describeDomainRecords =  function(domainName, callback) {
  this.domainRecordSize(domainName, function (size) {
    let params = {
      "DomainName": domainName,
      "PageSize": size
    };

    let requestOption = {
      method: 'POST'
    };

    client.request('DescribeDomainRecords', params, requestOption).then((result) => {
      callback(result.DomainRecords.Record);
    }, (ex) => {
      console.log(ex);
    });
  });
};

Aliyun.prototype.addDomainRecord = function(domainName, rr, type, value, callback) {
  let params = {
    "DomainName": domainName,
    "RR": rr,
    "Type": type,
    "Value": value
  };

  let requestOption = {
    method: 'POST'
  };

  client.request('AddDomainRecord', params, requestOption).then((result) => {
    callback(result);
  }, (ex) => {
    console.log(ex);
  });
};

Aliyun.prototype.updateDomainRecord = function(recordId, rr, type, value, callback) {
  let params = {
    "RecordId": recordId,
    "RR": rr,
    "Type": type,
    "Value": value
  };

  let requestOption = {
    method: 'POST'
  };

  client.request('UpdateDomainRecord', params, requestOption).then((result) => {
    callback(result);
  }, (ex) => {
    console.log(ex);
  });
};

Aliyun.prototype.addOrUpdateDomainRecord = function(domainName, rr, type, value, callback) {
  let that = this;
  this.findDomainRecords(domainName, rr, function (resultList) {
    if (resultList.length === 0) {
      that.addDomainRecord(domainName, rr, type, value, callback);
    } else if (resultList.length === 1) {
      if (resultList[0].Value !== value) {
        that.updateDomainRecord(resultList[0].RecordId, rr, type, value, callback);
      } else {
        console.warn('it has the value: ', value)
      }
    } else {
      console.error(rr+'.'+domainName, " has ", resultList.length)
    }
  })
};

Aliyun.prototype.findDomainRecords = function(domainName, host, callback) {
  this.describeDomainRecords(domainName, function (resultList) {
    let records = [];
    resultList.forEach(function (item) {

      if ((item.RR + '.' + item.DomainName) === (host + '.' + domainName)) {
        records.push(item);
      }
    });
    callback(records);
  });
};

module.exports = Aliyun;
