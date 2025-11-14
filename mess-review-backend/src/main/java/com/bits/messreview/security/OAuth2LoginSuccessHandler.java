package com.bits.messreview.security;

import com.bits.messreview.config.AppConfig;
import com.bits.messreview.entity.Role;
import com.bits.messreview.entity.User;
import com.bits.messreview.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final AppConfig appConfig;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {

        OAuth2AuthenticationToken oAuth2Token = (OAuth2AuthenticationToken) authentication;
        OAuth2User oAuth2User = oAuth2Token.getPrincipal();

        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        String providerId = oAuth2User.getAttribute("sub");

        // Validate BITS email domain
        if (email == null || !email.endsWith("@pilani.bits-pilani.ac.in")) {
            String targetUrl = UriComponentsBuilder.fromUriString("http://localhost:5173/signin")
                    .queryParam("error", "only_bits_email")
                    .build().toUriString();
            getRedirectStrategy().sendRedirect(request, response, targetUrl);
            return;
        }

        // Determine role based on admin email list
        Role userRole = appConfig.getEmails().contains(email) ? Role.ADMIN : Role.STUDENT;

        // Find or create user
        User user = userRepository.findByEmail(email)
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setEmail(email);
                    newUser.setName(name);
                    newUser.setProvider("google");
                    newUser.setProviderId(providerId);
                    newUser.setRole(userRole);
                    newUser.setEmailVerified(true);
                    newUser.setActive(true);
                    newUser.setPassword(""); // OAuth users don't need password
                    return userRepository.save(newUser);
                });

        // Update existing user's role if they're in the admin list
        if (!user.getRole().equals(userRole)) {
            user.setRole(userRole);
            user = userRepository.save(user);
        }

        // Generate JWT token
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());

        // Redirect to frontend with token
        String targetUrl = UriComponentsBuilder.fromUriString("http://localhost:5173/signin")
                .queryParam("token", token)
                .queryParam("name", user.getName())
                .queryParam("email", user.getEmail())
                .queryParam("role", user.getRole().name())
                .build().toUriString();

        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}
