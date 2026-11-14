const ISSUER='https://token.actions.githubusercontent.com';
export const AUDIENCE='ghostform-weekly-report';
export const TRUST=Object.freeze({repository:'rikyuuuuuuun/ghostform-growth-reports',repository_id:'1457459809',
  repository_owner_id:'300957289',ref:'refs/heads/main',
  workflow_ref:'rikyuuuuuuun/ghostform-growth-reports/.github/workflows/weekly.yml@refs/heads/main'});
const decode=part=>Uint8Array.from(atob(part.replaceAll('-','+').replaceAll('_','/')),c=>c.charCodeAt(0));
const json=part=>JSON.parse(new TextDecoder().decode(decode(part)));

// Trust the GitHub signature and immutable repository/owner IDs, never a caller-supplied key URL.
export function oidcVerifier({fetcher=fetch,now=Date.now,trust=TRUST}={}) {
  let keys=[],validUntil=0;
  return async authorization=>{
    if(typeof authorization!=='string'||authorization.length>16384||!authorization.startsWith('Bearer '))throw new Error('unauthorized');
    const token=authorization.slice(7),parts=token.split('.');
    if(parts.length!==3||parts.some(p=>!p||!/^[A-Za-z0-9_-]+$/.test(p)))throw new Error('unauthorized');
    const header=json(parts[0]),claims=json(parts[1]),time=Math.floor(now()/1000);
    if(header.alg!=='RS256'||header.typ!=='JWT'||typeof header.kid!=='string')throw new Error('unauthorized');
    if(claims.iss!==ISSUER||claims.aud!==AUDIENCE||claims.repository_visibility!=='private'
      ||claims.runner_environment!=='github-hosted'||!['schedule','workflow_dispatch'].includes(claims.event_name)
      ||Object.entries(trust).some(([key,value])=>claims[key]!==value))throw new Error('unauthorized');
    if(![claims.exp,claims.iat,claims.nbf].every(Number.isFinite)||claims.exp<=time-30||claims.iat>time+30
      ||claims.nbf>time+30||claims.exp<=claims.iat||claims.exp-claims.iat>600||claims.iat<time-600)throw new Error('unauthorized');
    if(now()>=validUntil||!keys.some(k=>k.kid===header.kid)){
      try{
        // Workers supports follow/manual, not redirect:error. Reject 3xx with the HTTP check.
        const response=await fetcher(ISSUER+'/.well-known/jwks',{signal:AbortSignal.timeout(10000),redirect:'manual'});
        if(!response.ok)throw new Error();
        const body=await response.json();if(!Array.isArray(body.keys))throw new Error();
        keys=body.keys;validUntil=now()+300000;
      }catch{throw new Error('identity_unavailable');}
    }
    const jwk=keys.find(k=>k.kid===header.kid&&k.kty==='RSA'&&(!k.use||k.use==='sig'));
    if(!jwk)throw new Error('unauthorized');
    const key=await crypto.subtle.importKey('jwk',jwk,{name:'RSASSA-PKCS1-v1_5',hash:'SHA-256'},false,['verify']);
    const valid=await crypto.subtle.verify('RSASSA-PKCS1-v1_5',key,decode(parts[2]),new TextEncoder().encode(parts[0]+'.'+parts[1]));
    if(!valid)throw new Error('unauthorized');return claims;
  };
}
