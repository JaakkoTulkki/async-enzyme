import Enzyme from 'enzyme';

export function waitFor(component: Enzyme.ReactWrapper , selector: string, timeout: number=100) {
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

export function waitNotToThrow(component: Enzyme.ReactWrapper, cb: (component: Enzyme.ReactWrapper) => void, timeout:number=100) {
  component.update();
  let errorMessage = '';
  return new Promise((resolve, reject) => {
    let timeCounter = 0;
    const interval = 2;
    const intervalId = setInterval(() => {
      try {
        cb(component);
        clearInterval(intervalId);
        return resolve();
      } catch (e) {
        errorMessage = e.message;
        component.update();
        timeCounter += interval;
        if(timeCounter >= timeout) {
          clearInterval(intervalId);
          return reject(new Error('Still rejecting after ' + timeout + 'ms: ' + errorMessage));
        }
      }
    }, interval);
  })
}
