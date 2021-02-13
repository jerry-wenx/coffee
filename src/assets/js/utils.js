import { Toast } from 'vant'

class Utils {

    //验证表单
    verificationFrom(obj) {
        for (let key in obj) {
            if (!obj[key].reg.test(obj[key].value)) {
                Toast({
                    message: obj[key].errorMsg,
                    forbidClick: true
                });
                return false;
            }
        }

        //验证成功
        return true;
    }

  
}


export const utils = new Utils();