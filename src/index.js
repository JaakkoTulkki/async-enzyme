function waitFor(component , selector, timeout=100) {
    let timeCounter = 0;
    const interval = 2;
    return new Promise((resolve, reject) => {
        component.update();
        let intervalId = setInterval(function () {
            const elemLength = component.find(selector).length;

            if(elemLength === 0) {
                component.update();
            }

            if(elemLength > 0){
                clearInterval(intervalId);
                return resolve();
            }

            timeCounter += interval;
            if(timeCounter >= timeout) {
                clearInterval(intervalId);
                return reject(
                    new Error('Could not locate element with the following selector: ' + selector + ' in ' + timeout +'ms')
                );
            }
        }, interval);
    })
}

module.exports = {
  waitFor,
}
