import { inject } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { TermService } from '../../services/term.service';
import { RoutePaths } from '../../constants/route-paths.enum';

export const termGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const termService = inject(TermService);
  const router = inject(Router);

  const user = authService.getCurrentUser();
  const latestTerm = termService.getLatestStored();

  if (user && latestTerm) {
    const needsToAccept =
      user.termVersion < latestTerm.version || user.termId < latestTerm.id;

    if (needsToAccept) {
      router.navigate([RoutePaths.AcceptTerms], { queryParams: { returnUrl: state.url } });
      return false;
    }
  }

  return true;
};
