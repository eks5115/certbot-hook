
let rootDomains =
[".co.jp",
".com.tw",
".net",
".com",
".com.cn",
".org",
".cn",
".gov",
".net.cn",
".io",
".top",
".me",
".int",
".edu",
".link",
".uk",
".hk"];

function calcRootDomain(domainName) {
  let root = undefined;
  rootDomains.forEach(function (item) {
    let a = domainName.search(item + '$');
    if (a !== -1) {
      if (root === undefined) {
        root = item;
      } else {
        if (item.length > root.length) {
          root = item;
        }
      }
    }
  });

  return root;
}

function calcSecondDomain(domainName, rootDomain) {
  let index = domainName.indexOf(rootDomain);
  let tempSecondDomain = domainName.substr(0, index);
  if (tempSecondDomain.match('.')) {
    return tempSecondDomain.substr(tempSecondDomain.lastIndexOf('.'), tempSecondDomain.length-1);
  } else {
    return tempSecondDomain;
  }
}

function calcPrefixDomain(domainName, rootDomain, secondDomain) {
  return domainName.substr(0, domainName.indexOf(secondDomain+rootDomain));
}

function calcSecondAndRootDomain(rootDomain, secondDomain) {
  let srDomain = secondDomain + rootDomain;
  return srDomain.substr(1, srDomain.length);
}

function calcAcmeRR(prefixDomain) {
  if (prefixDomain === "") {
    return '_acme-challenge';
  } else {
    return '_acme-challenge.' + prefixDomain;
  }
}

let Domain = function(domainName) {
  this.rootDomain = calcRootDomain(domainName);
  this.secondDomain = calcSecondDomain(domainName, this.rootDomain);
  this.prefixDomain = calcPrefixDomain(domainName, this.rootDomain, this.secondDomain);
  this.secondAndRootDomain = calcSecondAndRootDomain(this.rootDomain, this.secondDomain);
  this.acmeRR = calcAcmeRR(this.prefixDomain);
};

Domain.prototype.getRootDomain = function() {
  return this.rootDomain;
};

Domain.prototype.getSecondDomain = function() {
  return this.secondDomain;
};

Domain.prototype.getPrefixDomain = function() {
  return this.prefixDomain;
};

Domain.prototype.getSecondAndRootDomain = function() {
  return this.secondAndRootDomain;
};

Domain.prototype.getAcmeRR = function() {
  return this.acmeRR;
};

module.exports = Domain;