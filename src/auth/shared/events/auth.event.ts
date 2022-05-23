export const enum LOGIN_EVENT {
    CONNECTED = 'auth:login.connected',
    SHOW_UI = 'auth:login.showUI',
    REQUEST = 'auth:login.required',
    RESPONSE = 'auth:login.response',
    FINISH = 'auth:login.finish',
    SETUSERNAME = 'auth:login.setUsername'
}

export const enum CREATE_CHARACTER_EVENT {
    SHOW_UI = 'auth:newCharacter.showUI',
    SETINFO = 'auth:newCharacter.setInfo',
    SETFACEFEATURES = 'auth:newCharacter.setFaceFeatures',
    SETAPPARELS = 'auth:newCharacter.setApparels',
    SETCLOTHES = 'auth:newCharacter.setClothes',
    CREATE = 'auth:newCharacter.create',
    FINISH = 'auth:newCharacter.finish'
}
