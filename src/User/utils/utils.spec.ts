import { compareHashPassword, generateHashPassword } from './utils';

describe('Password hashing', () => {

  const password = '123123';
  let chamou;

  beforeEach(async () => {
    chamou = await generateHashPassword(password);
  });

  it('should be called', () => {
    expect(chamou).toBeTruthy();
  });

  it('should not give same password', () => {
    const comparacao = (chamou == password);
    expect(comparacao).toBeFalsy();
  });

  it('should throw without password', async () => {
    try {
      const test = await generateHashPassword('');
      expect(test).toThrow();
    } catch (err) {
      expect(err.message).toBe('Password is required.');
    }
  });

});

describe('Password decrypting', () => {

  const password = '123123';
  const firstHashed123123 = '$2b$10$Hfj1ZykBFE2J8mMveZHaPeXhDRAF3qPIeh7MiMczKV7X21EzaxDLC';
  const fakePassword = 'not123';
  const hashedFakePassword = '$2b$10$revOlPdj5X/BjJDArAUDR.6UC1Cto.RJfnGaarX6elf9HVcMLRS3a';

  it('should give a boolean', async () => {
    const passwordComparation = await compareHashPassword(password, firstHashed123123);
    const resultOfComparation = (typeof passwordComparation === 'boolean');
    expect(resultOfComparation).toBeTruthy();
  });

  it('should give true when comparing password 123123 to the first hash of 123123 ', async () => {
    const comparacao = await compareHashPassword(password, firstHashed123123);
    expect(comparacao).toBe(true);
  });

  it('should give false when comparing password 123123 to the hash of the fake password ', async () => {
    const comparacao = await compareHashPassword(password, hashedFakePassword);
    expect(comparacao).toBe(false);
  });

  it('should throw without password', async () => {
    try {
      const test = await compareHashPassword('', hashedFakePassword);
      expect(test).toThrow();
    } catch (err) {
      expect(err.message).toBe('Password is required.');
    }
  });

  it('should throw without hashed password', async () => {
    try {
      const test = await compareHashPassword(password, '');
      expect(test).toThrow();
    } catch (err) {
      expect(err.message).toBe('Hashed Password is required.');
    }
  });
});


describe('Password hash and decrypting', () => {

  const password = '123123';
  const fakePassword = 'not123';

  it('should give true if same password is used', async () => {
    const hashedPassword = await generateHashPassword(password);
    const comparedSamePassword = await compareHashPassword(password, hashedPassword);
    expect(comparedSamePassword).toBe(true);
  });

  it('should give false if different password is used', async () => {
    const hashedFakePassword = await generateHashPassword(fakePassword);
    const comparedDifferentPassword = await compareHashPassword(password, hashedFakePassword);
    expect(comparedDifferentPassword).toBe(false);
  });

});