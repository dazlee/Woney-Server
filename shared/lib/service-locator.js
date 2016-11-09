function ServiceLocator () {
    this._registry = {};
}

ServiceLocator.prototype.get = function (name) {
    var service = this._registry[name];
    if (!service) {
        throw new Erorr("No service registered with name " + name);
    }
    return service;
};

ServiceLocator.prototype.register = function (name, service) {
    var existing = this._registry[name];
    if (existing) {
        throw new Error("Service already registered with name " + name);
    }
    this._registry[name] = service;
    return this;
};

ServiceLocator.prototype.unregister = function (name) {
    delete this._registry[name];
    return this;
};

ServiceLocator.prototype.reset = function () {
    this._registry = {};
    return this;
};

module.exports = ServiceLocator;
